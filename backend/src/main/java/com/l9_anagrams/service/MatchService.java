package com.l9_anagrams.service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.MatchResponseDto;
import com.l9_anagrams.dto.MatchResponseDto.MatchPlayerDto;
import com.l9_anagrams.entity.Challenge;
import com.l9_anagrams.entity.Match;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.enums.MatchStatus;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.repo.ChallengeRepo;
import com.l9_anagrams.repo.MatchRepo;
import com.l9_anagrams.repo.PlayerRepo;

import tools.jackson.databind.json.JsonMapper;

@Service
public class MatchService {
	private static final JsonMapper PAYLOAD_MAPPER = JsonMapper.builder().build();

	private final MatchRepo matchRepo;
	private final ChallengeRepo challengeRepo;
	private final PlayerRepo playerRepo;

	public MatchService(MatchRepo matchRepo, ChallengeRepo challengeRepo, PlayerRepo playerRepo) {
		this.matchRepo = matchRepo;
		this.challengeRepo = challengeRepo;
		this.playerRepo = playerRepo;
	}

	@Transactional(readOnly = true)
	public MatchResponseDto get(String email, Long matchId) {
		Player viewer = currentPlayer(email);
		Match match = readyMatch(matchId, viewer);

		Map<String, MatchPlayerDto> players = new LinkedHashMap<>();
		players.put("A", new MatchPlayerDto(match.getChallenger().getId(), match.getChallenger().getNickName(),
				match.getChallengerDeckSnapshot().getGod()));
		players.put("B", new MatchPlayerDto(match.getChallenged().getId(), match.getChallenged().getNickName(),
				match.getChallengedDeckSnapshot().getGod()));

		return new MatchResponseDto(
				match.getId(),
				isChallenger(match, viewer) ? "A" : "B",
				match.getCompletedAt(),
				players,
				PAYLOAD_MAPPER.readTree(match.getEnginePayload()));
	}

	/** Il giocatore ha aperto il Rotolo: la partita esce da "Da giocare" / "Ti aspettano". */
	@Transactional
	public void markSeen(String email, Long matchId) {
		Player viewer = currentPlayer(email);
		Match match = readyMatch(matchId, viewer);
		Challenge challenge = match.getChallenge();
		LocalDateTime now = LocalDateTime.now();
		if (isChallenger(match, viewer)) {
			if (challenge.getChallengerReadAt() == null) {
				challenge.setChallengerReadAt(now);
			}
		} else if (challenge.getChallengedReadAt() == null) {
			challenge.setChallengedReadAt(now);
		}
		challengeRepo.save(challenge);
	}

	private Match readyMatch(Long matchId, Player viewer) {
		return matchRepo.findByIdAndParticipant(matchId, viewer.getId())
				.filter(match -> match.getStatus() == MatchStatus.READY && match.getEnginePayload() != null)
				.orElseThrow(() -> new ResourceNotFoundException("Partita non trovata"));
	}

	private static boolean isChallenger(Match match, Player viewer) {
		return match.getChallenger().getId().equals(viewer.getId());
	}

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}
}
