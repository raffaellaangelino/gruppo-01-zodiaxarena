package com.l9_anagrams.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.l9_anagrams.dto.ChallengeCreatedDto;
import com.l9_anagrams.dto.ChallengeItemDto;
import com.l9_anagrams.dto.ChallengeListResponseDto;
import com.l9_anagrams.dto.ChallengeEventDto;
import com.l9_anagrams.dto.MatchCreatedDto;
import com.l9_anagrams.entity.Challenge;
import com.l9_anagrams.entity.Match;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.enums.ChallengeCancelReason;
import com.l9_anagrams.enums.ChallengeStatus;
import com.l9_anagrams.enums.MatchOutcome;
import com.l9_anagrams.enums.MatchStatus;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ConflictException;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.integration.engine.client.EngineClient;
import com.l9_anagrams.integration.engine.mapper.ChallengeEngineMapper;
import com.l9_anagrams.repo.ChallengeRepo;
import com.l9_anagrams.repo.MatchRepo;
import com.l9_anagrams.repo.PlayerRepo;

import tools.jackson.databind.JsonNode;

@Service
public class ChallengeService {
	private final ChallengeRepo challengeRepo;
	private final MatchRepo matchRepo;
	private final PlayerRepo playerRepo;
	private final ChallengeDeckService deckService;
	private final EngineClient engineClient;
	private final ChallengeEngineMapper engineMapper;
	private final ChallengeSseRegistry sseRegistry;

	public ChallengeService(
			ChallengeRepo challengeRepo,
			MatchRepo matchRepo,
			PlayerRepo playerRepo,
			ChallengeDeckService deckService,
			EngineClient engineClient,
			ChallengeEngineMapper engineMapper,
			ChallengeSseRegistry sseRegistry) {
		this.challengeRepo = challengeRepo;
		this.matchRepo = matchRepo;
		this.playerRepo = playerRepo;
		this.deckService = deckService;
		this.engineClient = engineClient;
		this.engineMapper = engineMapper;
		this.sseRegistry = sseRegistry;
	}

	@Transactional
	public ChallengeCreatedDto create(String email, Long opponentId, Long deckId) {
		Player challenger = currentPlayer(email);
		if (challenger.getId().equals(opponentId)) {
			throw new ConflictException(ApiErrorCode.CANNOT_CHALLENGE_SELF, "A player cannot challenge themselves");
		}
		Player challenged = playerRepo.findById(opponentId)
				.orElseThrow(() -> new ResourceNotFoundException("Avversario non trovato"));

		lockPlayers(challenger.getId(), challenged.getId());
		if (challengeRepo.existsByChallengerIdAndChallengedIdAndStatus(challenger.getId(), challenged.getId(), ChallengeStatus.PENDING)
				|| challengeRepo.existsByChallengedIdAndChallengerIdAndStatus(challenger.getId(), challenged.getId(), ChallengeStatus.PENDING)) {
			throw pendingConflict(challenger, challenged);
		}

		Challenge challenge = new Challenge();
		challenge.setChallenger(challenger);
		challenge.setChallenged(challenged);
		challenge.setStatus(ChallengeStatus.PENDING);
		challenge.setChallengerDeckSnapshot(deckService.snapshotOwnedDeck(challenger, deckId));
		LocalDateTime now = LocalDateTime.now();
		challenge.setCreatedAt(now);
		challenge.setUpdatedAt(now);
		challengeRepo.save(challenge);

		sseRegistry.send(challenged.getId(), "CHALLENGE_RECEIVED",
				new ChallengeEventDto(challenge.getId(), null, ChallengeStatus.PENDING.name()));
		return new ChallengeCreatedDto(challenge.getId());
	}

	private ConflictException pendingConflict(Player challenger, Player challenged) {
		Challenge existing = challengeRepo.findByChallengerIdAndStatus(challenger.getId(), ChallengeStatus.PENDING).stream()
				.filter(item -> item.getChallenged().getId().equals(challenged.getId()))
				.findFirst()
				.orElseGet(() -> challengeRepo.findByChallengerIdAndStatus(challenged.getId(), ChallengeStatus.PENDING).stream()
						.filter(item -> item.getChallenged().getId().equals(challenger.getId()))
						.findFirst()
						.orElse(null));
		String message = existing == null
				? "A challenge is already pending"
				: "A challenge is already pending (challengeId=" + existing.getId() + ")";
		return new ConflictException(ApiErrorCode.CHALLENGE_ALREADY_PENDING, message);
	}

	@Transactional(readOnly = true)
	public ChallengeListResponseDto list(String email, String box) {
		Player player = currentPlayer(email);
		List<ChallengeItemDto> items;
		if ("TO_PLAY".equalsIgnoreCase(box)) {
			items = challengeRepo.findByChallengedIdOrderByCreatedAtDesc(player.getId()).stream()
					.filter(challenge -> challenge.getStatus() == ChallengeStatus.PENDING
							|| (challenge.getStatus() == ChallengeStatus.PLAYED && challenge.getChallengedReadAt() == null))
					.map(challenge -> ChallengeItemDto.from(challenge, challenge.getChallenger(), "RECEIVED"))
					.toList();
		} else if ("SENT".equalsIgnoreCase(box)) {
			items = challengeRepo.findByChallengerIdOrderByCreatedAtDesc(player.getId()).stream()
					.filter(challenge -> challenge.getStatus() == ChallengeStatus.PENDING
							|| challenge.getStatus() != ChallengeStatus.PENDING)
					.map(challenge -> ChallengeItemDto.from(challenge, challenge.getChallenged(), "SENT"))
					.toList();
		} else {
			throw new IllegalArgumentException("box must be TO_PLAY or SENT");
		}
		return new ChallengeListResponseDto(items);
	}

	@Transactional
	public MatchCreatedDto accept(String email, Long challengeId, Long deckId) {
		Player challenged = currentPlayer(email);
		Challenge challenge = challengeRepo.findByIdAndChallengedId(challengeId, challenged.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Sfida non trovata"));
		if (challenge.getStatus() != ChallengeStatus.PENDING) {
			throw new ConflictException(ApiErrorCode.CHALLENGE_NOT_PENDING, "The challenge is not pending");
		}

		Match match = challenge.getMatch();
		if (match == null) {
			match = new Match();
			match.setChallenge(challenge);
			match.setChallenger(challenge.getChallenger());
			match.setChallenged(challenged);
			match.setChallengerDeckSnapshot(challenge.getChallengerDeckSnapshot());
			match.setStatus(MatchStatus.PENDING);
			match.setCreatedAt(LocalDateTime.now());
		}

		match.setChallengedDeckSnapshot(deckService.snapshotOwnedDeck(challenged, deckId));
		match = matchRepo.save(match);

		try {
			JsonNode result = engineClient.playMatch(
					engineMapper.toParticipant(challenge.getChallenger(), challenge.getChallengerDeckSnapshot()),
					engineMapper.toParticipant(challenged, match.getChallengedDeckSnapshot()),
					java.util.Optional.empty());

			JsonNode outcomeNode = result.get("outcome");
			if (outcomeNode == null) {
				throw new IllegalArgumentException("Engine response has no outcome");
			}
			MatchOutcome outcome = mapOutcome(outcomeNode.asString());
			JsonNode seedNode = result.get("seed");
			if (seedNode != null && seedNode.isIntegralNumber()) {
				match.setEngineSeed(seedNode.longValue());
			}
			match.setEnginePayload(result.toString());
			match.setOutcome(outcome);
			match.setStatus(MatchStatus.READY);
			match.setCompletedAt(LocalDateTime.now());
			matchRepo.save(match);

			challenge.setStatus(ChallengeStatus.PLAYED);
			challenge.setUpdatedAt(LocalDateTime.now());
			challenge.setChallengedReadAt(null);
			challengeRepo.save(challenge);

			sseRegistry.send(challenge.getChallenger().getId(), "MATCH_READY",
					new ChallengeEventDto(challenge.getId(), match.getId(), MatchStatus.READY.name()));
			sseRegistry.send(challenged.getId(), "MATCH_READY",
					new ChallengeEventDto(challenge.getId(), match.getId(), MatchStatus.READY.name()));
			return new MatchCreatedDto(match.getId());
		} catch (com.l9_anagrams.integration.engine.exception.EngineClientException exception) {
			match.setStatus(MatchStatus.ENGINE_FAILED);
			matchRepo.save(match);
			sseRegistry.send(challenge.getChallenger().getId(), "MATCH_FAILED",
					new ChallengeEventDto(challenge.getId(), match.getId(), MatchStatus.ENGINE_FAILED.name()));
			sseRegistry.send(challenged.getId(), "MATCH_FAILED",
					new ChallengeEventDto(challenge.getId(), match.getId(), MatchStatus.ENGINE_FAILED.name()));
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "ENGINE_UNAVAILABLE");
		} catch (RuntimeException exception) {
			match.setStatus(MatchStatus.ENGINE_FAILED);
			matchRepo.save(match);
			sseRegistry.send(challenge.getChallenger().getId(), "MATCH_FAILED",
					new ChallengeEventDto(challenge.getId(), match.getId(), MatchStatus.ENGINE_FAILED.name()));
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "INVALID_ENGINE_RESPONSE");
		}
	}

	private MatchOutcome mapOutcome(String outcome) {
		return switch (outcome) {
			case "PLAYER1_WINS", "CHALLENGER_WINS" -> MatchOutcome.CHALLENGER_WIN;
			case "PLAYER2_WINS", "CHALLENGED_WINS" -> MatchOutcome.CHALLENGED_WIN;
			case "DRAW" -> MatchOutcome.DRAW;
			default -> throw new IllegalArgumentException("Unknown engine outcome: " + outcome);
		};
	}

	@Transactional
	public void decline(String email, Long challengeId) {
		Player challenged = currentPlayer(email);
		Challenge challenge = challengeRepo.findByIdAndChallengedId(challengeId, challenged.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Sfida non trovata"));
		requirePending(challenge);
		cancel(challenge, ChallengeCancelReason.DECLINED);
		sseRegistry.send(challenge.getChallenger().getId(), "CHALLENGE_STATUS_CHANGED",
				new ChallengeEventDto(challenge.getId(), null, ChallengeStatus.DECLINED.name()));
	}

	@Transactional
	public void withdraw(String email, Long challengeId) {
		Player challenger = currentPlayer(email);
		Challenge challenge = challengeRepo.findByIdAndChallengerId(challengeId, challenger.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Sfida non trovata"));
		requirePending(challenge);
		cancel(challenge, ChallengeCancelReason.WITHDRAWN);
		sseRegistry.send(challenge.getChallenged().getId(), "CHALLENGE_STATUS_CHANGED",
				new ChallengeEventDto(challenge.getId(), null, ChallengeStatus.WITHDRAWN.name()));
	}

	private void requirePending(Challenge challenge) {
		if (challenge.getStatus() != ChallengeStatus.PENDING) {
			throw new ConflictException(ApiErrorCode.CHALLENGE_NOT_PENDING, "The challenge is not pending");
		}
	}

	private void cancel(Challenge challenge, ChallengeCancelReason reason) {
		challenge.setStatus(reason == ChallengeCancelReason.DECLINED
				? ChallengeStatus.DECLINED
				: ChallengeStatus.WITHDRAWN);
		challenge.setCancelReason(reason);
		challenge.setUpdatedAt(LocalDateTime.now());
		challengeRepo.save(challenge);
	}

	private void lockPlayers(Long firstId, Long secondId) {
		long first = Math.min(firstId, secondId);
		long second = Math.max(firstId, secondId);
		playerRepo.findByForUpdate(first);
		playerRepo.findByForUpdate(second);
	}

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}
}
