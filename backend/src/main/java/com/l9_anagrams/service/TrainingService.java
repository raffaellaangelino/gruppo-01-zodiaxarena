package com.l9_anagrams.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.TrainingMatchResponseDto;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.ChallengeDeckCardSnapshot;
import com.l9_anagrams.entity.ChallengeDeckSnapshot;
import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.enums.God;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ApiException;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.integration.engine.client.EngineClient;
import com.l9_anagrams.integration.engine.exception.EngineClientException;
import com.l9_anagrams.integration.engine.exception.EngineErrors;
import com.l9_anagrams.integration.engine.mapper.ChallengeEngineMapper;
import com.l9_anagrams.repo.CardDefinitionRepo;
import com.l9_anagrams.repo.PlanetRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.repo.SignRepo;

import java.util.Optional;

@Service
public class TrainingService {
	private final PlayerRepo playerRepo;
	private final CardDefinitionRepo cardDefinitionRepo;
	private final PlanetRepo planetRepo;
	private final SignRepo signRepo;
	private final ChallengeDeckService deckService;
	private final EngineClient engineClient;
	private final ChallengeEngineMapper engineMapper;

	public TrainingService(
			PlayerRepo playerRepo,
			CardDefinitionRepo cardDefinitionRepo,
			PlanetRepo planetRepo,
			SignRepo signRepo,
			ChallengeDeckService deckService,
			EngineClient engineClient,
			ChallengeEngineMapper engineMapper) {
		this.playerRepo = playerRepo;
		this.cardDefinitionRepo = cardDefinitionRepo;
		this.planetRepo = planetRepo;
		this.signRepo = signRepo;
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
			throw EngineErrors.toApiException(exception);
		}
		return new TrainingMatchResponseDto(900L);
	}

	/**
	 * Il Cielo di Ermes: una creatura per pianeta e tutti e quattro gli elementi
	 * (Fuoco 2, Terra 2, Aria 2, Acqua 1), come chiede la validazione dell'engine.
	 */
	private static final String[][] ERMES_CARDS = {
			{ "Sole", "Ariete" },
			{ "Luna", "Toro" },
			{ "Marte", "Gemelli" },
			{ "Giove", "Cancro" },
			{ "Saturno", "Leone" },
			{ "Mercurio", "Vergine" },
			{ "Venere", "Bilancia" },
	};
	private static final String ERMES_ASCENDANT_SIGN = "Bilancia";

	private ChallengeDeckSnapshot fixedErmesDeck() {
		ChallengeDeckSnapshot snapshot = new ChallengeDeckSnapshot();
		snapshot.setCapturedAt(LocalDateTime.now());
		snapshot.setGod(God.ERA);
		List<ChallengeDeckCardSnapshot> cards = new ArrayList<>();
		for (int position = 0; position < ERMES_CARDS.length; position++) {
			ChallengeDeckCardSnapshot card = new ChallengeDeckCardSnapshot();
			card.setDeckSnapshot(snapshot);
			card.setCardDefinition(creature(ERMES_CARDS[position][0], ERMES_CARDS[position][1]));
			card.setPosition(position);
			cards.add(card);
		}
		snapshot.setCardSnapshots(cards);
		signRepo.findByName(ERMES_ASCENDANT_SIGN)
				.flatMap(sign -> cardDefinitionRepo.findBySignIdAndPlanetIsNull(sign.getId()))
				.ifPresent(snapshot::setAscendantCardDefinition);
		return snapshot;
	}

	private CardDefinition creature(String planetName, String signName) {
		Planet planet = planetRepo.findByName(planetName).orElseThrow(TrainingService::deckUnavailable);
		Sign sign = signRepo.findByName(signName).orElseThrow(TrainingService::deckUnavailable);
		return cardDefinitionRepo.findByPlanetIdAndSignId(planet.getId(), sign.getId())
				.orElseThrow(TrainingService::deckUnavailable);
	}

	private static ApiException deckUnavailable() {
		return new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, ApiErrorCode.INTERNAL_ERROR,
				"Fixed training deck is missing from the catalog");
	}
}
