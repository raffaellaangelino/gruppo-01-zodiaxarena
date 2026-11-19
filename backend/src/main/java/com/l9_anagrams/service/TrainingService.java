package com.l9_anagrams.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.l9_anagrams.dto.TrainingMatchResponseDto;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.ChallengeDeckCardSnapshot;
import com.l9_anagrams.entity.ChallengeDeckSnapshot;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.enums.CardType;
import com.l9_anagrams.enums.God;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.integration.engine.client.EngineClient;
import com.l9_anagrams.integration.engine.exception.EngineClientException;
import com.l9_anagrams.integration.engine.mapper.ChallengeEngineMapper;
import com.l9_anagrams.repo.CardDefinitionRepo;
import com.l9_anagrams.repo.PlayerRepo;

import java.util.Optional;

@Service
public class TrainingService {
	private final PlayerRepo playerRepo;
	private final CardDefinitionRepo cardDefinitionRepo;
	private final ChallengeDeckService deckService;
	private final EngineClient engineClient;
	private final ChallengeEngineMapper engineMapper;

	public TrainingService(
			PlayerRepo playerRepo,
			CardDefinitionRepo cardDefinitionRepo,
			ChallengeDeckService deckService,
			EngineClient engineClient,
			ChallengeEngineMapper engineMapper) {
		this.playerRepo = playerRepo;
		this.cardDefinitionRepo = cardDefinitionRepo;
		this.deckService = deckService;
		this.engineClient = engineClient;
		this.engineMapper = engineMapper;
	}

	@Transactional(readOnly = true)
	public TrainingMatchResponseDto play(String email, Long deckId) {
		Player challenger = playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
		ChallengeDeckSnapshot challengerDeck = deckService.snapshotOwnedDeck(challenger, deckId);

		Player ermes = new Player();
		ermes.setId(0L);
		ermes.setNickName("Ermes");
		ermes.setGod(God.ERA);

		ChallengeDeckSnapshot fixedDeck = fixedErmesDeck();
		try {
			engineClient.playMatch(
					engineMapper.toParticipant(challenger, challengerDeck),
					engineMapper.toParticipant(ermes, fixedDeck),
					Optional.empty());
		} catch (EngineClientException exception) {
			throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "ENGINE_UNAVAILABLE");
		}
		return new TrainingMatchResponseDto(900L);
	}

	private ChallengeDeckSnapshot fixedErmesDeck() {
		ChallengeDeckSnapshot snapshot = new ChallengeDeckSnapshot();
		snapshot.setCapturedAt(LocalDateTime.now());
		snapshot.setGod(God.ERA);
		List<CardDefinition> creatures = cardDefinitionRepo.findByType(CardType.CREATURE);
		if (creatures.size() < 7) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "FIXED_TRAINING_DECK_UNAVAILABLE");
		}
		List<ChallengeDeckCardSnapshot> cards = new ArrayList<>();
		for (int position = 0; position < 7; position++) {
			ChallengeDeckCardSnapshot card = new ChallengeDeckCardSnapshot();
			card.setDeckSnapshot(snapshot);
			card.setCardDefinition(creatures.get(position));
			card.setPosition(position);
			cards.add(card);
		}
		snapshot.setCardSnapshots(cards);
		cardDefinitionRepo.findByType(CardType.ASCENDANT).stream().findFirst()
				.ifPresent(snapshot::setAscendantCardDefinition);
		return snapshot;
	}
}
