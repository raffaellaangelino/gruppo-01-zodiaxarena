package com.l9_anagrams.integration.engine.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.integration.engine.dto.CreatureCardSnapshot;
import com.l9_anagrams.integration.engine.dto.EngineElement;
import com.l9_anagrams.integration.engine.dto.EngineGameRequest;
import com.l9_anagrams.integration.engine.dto.MatchParticipantSnapshot;
import com.l9_anagrams.integration.engine.dto.SignSnapshot;

@Component
public class EngineRequestMapper {
	public EngineGameRequest toEngineRequest(
			MatchParticipantSnapshot player1,
			MatchParticipantSnapshot player2,
			Optional<Long> seed) {
		Objects.requireNonNull(player1, "Player 1 snapshot is required");
		Objects.requireNonNull(player2, "Player 2 snapshot is required");

		return new EngineGameRequest(toEnginePlayer(player1), toEnginePlayer(player2), seed);
	}

	private EngineGameRequest.EnginePlayer toEnginePlayer(MatchParticipantSnapshot participant) {
		List<EngineGameRequest.EngineCard> cards = participant.deck().cards().stream()
				.map(this::toEngineCard)
				.toList();
		Optional<EngineGameRequest.EngineAscendant> ascendant = participant.deck().ascendant()
				.map(value -> new EngineGameRequest.EngineAscendant(toEngineSign(value.sign())));
		return new EngineGameRequest.EnginePlayer(participant.player().god(), ascendant, cards);
	}

	private EngineGameRequest.EngineCard toEngineCard(CreatureCardSnapshot card) {
		return new EngineGameRequest.EngineCard(
				toEngineSign(card.sign()),
				new EngineGameRequest.EnginePlanet(
						card.planet().name(), card.planet().attackBonus(), card.planet().defenseBonus()),
				card.house());
	}

	private EngineGameRequest.EngineSign toEngineSign(SignSnapshot sign) {
		return new EngineGameRequest.EngineSign(
				sign.name(), toEngineElement(sign.element()), sign.attack(), sign.defense());
	}

	private EngineElement toEngineElement(SignType element) {
		return switch (element) {
			case WATER -> EngineElement.ACQUA;
			case FIRE -> EngineElement.FUOCO;
			case EARTH -> EngineElement.TERRA;
			case AIR -> EngineElement.ARIA;
		};
	}
}