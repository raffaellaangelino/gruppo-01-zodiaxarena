package com.l9_anagrams.integration.engine.mapper;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.l9_anagrams.entity.ChallengeDeckSnapshot;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.integration.engine.dto.AscendantSnapshot;
import com.l9_anagrams.integration.engine.dto.CreatureCardSnapshot;
import com.l9_anagrams.integration.engine.dto.DeckSnapshot;
import com.l9_anagrams.integration.engine.dto.MatchParticipantSnapshot;
import com.l9_anagrams.integration.engine.dto.PlanetSnapshot;
import com.l9_anagrams.integration.engine.dto.PlayerSnapshot;
import com.l9_anagrams.integration.engine.dto.SignSnapshot;

@Component
public class ChallengeEngineMapper {
	public MatchParticipantSnapshot toParticipant(Player player, ChallengeDeckSnapshot snapshot) {
		Optional<AscendantSnapshot> ascendant = snapshot.getAscendantCardDefinition() == null
				? Optional.empty()
				: Optional.of(new AscendantSnapshot(toSign(snapshot.getAscendantCardDefinition())));

		List<CreatureCardSnapshot> cards = snapshot.getCardSnapshots().stream()
				.sorted(java.util.Comparator.comparingInt(c -> c.getPosition()))
				.map(card -> toCreatureCard(card.getCardDefinition()))
				.toList();

		return new MatchParticipantSnapshot(
				new PlayerSnapshot(player.getGod()),
				new DeckSnapshot(ascendant, cards));
	}

	private CreatureCardSnapshot toCreatureCard(CardDefinition definition) {
		return new CreatureCardSnapshot(
				toSign(definition),
				new PlanetSnapshot(
						definition.getPlanet().getName(),
						definition.getPlanet().getAtk(),
						definition.getPlanet().getDef()),
				definition.getHouse());
	}

	private SignSnapshot toSign(CardDefinition definition) {
		return new SignSnapshot(
				definition.getSign().getName(),
				definition.getSign().getType(),
				definition.getSign().getAtk(),
				definition.getSign().getDef());
	}
}
