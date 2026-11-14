package com.l9_anagrams.integration.engine.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.God;
import com.l9_anagrams.enums.House;
import com.l9_anagrams.integration.engine.dto.AscendantSnapshot;
import com.l9_anagrams.integration.engine.dto.CreatureCardSnapshot;
import com.l9_anagrams.integration.engine.dto.DeckSnapshot;
import com.l9_anagrams.integration.engine.dto.EngineElement;
import com.l9_anagrams.integration.engine.dto.EngineGameRequest;
import com.l9_anagrams.integration.engine.dto.MatchParticipantSnapshot;
import com.l9_anagrams.integration.engine.dto.PlanetSnapshot;
import com.l9_anagrams.integration.engine.dto.PlayerSnapshot;
import com.l9_anagrams.integration.engine.dto.SignSnapshot;

class EngineRequestMapperTest {
	private final EngineRequestMapper mapper = new EngineRequestMapper();

	@Test
	void mapsParticipantsToEngineVocabularyAndForwardsOptionalSeed() {
		MatchParticipantSnapshot player1 = participant(
				Optional.of(new AscendantSnapshot(sign("Gemelli", SignType.AIR))),
				List.of(creature("Ariete", SignType.FIRE, "Sole", House.I)));
		MatchParticipantSnapshot player2 = participant(
				Optional.empty(),
				List.of(creature("Cancro", SignType.WATER, "Luna", House.XII)));

		EngineGameRequest request = mapper.toEngineRequest(player1, player2, Optional.of(123L));

		assertEquals(God.ERA, request.player1().god());
		assertEquals(EngineElement.ARIA, request.player1().ascendant().orElseThrow().sign().element());
		assertEquals(EngineElement.FUOCO, request.player1().cards().get(0).sign().element());
		assertEquals(House.I, request.player1().cards().get(0).house());
		assertEquals(EngineElement.ACQUA, request.player2().cards().get(0).sign().element());
		assertTrue(request.player2().ascendant().isEmpty());
		assertEquals(123L, request.seed().orElseThrow());
	}

	@Test
	void rejectsCreatureSnapshotsWithoutAHouse() {
		assertThrows(NullPointerException.class,
				() -> new CreatureCardSnapshot(sign("Ariete", SignType.FIRE), planet("Sole"), null));
	}

	private static MatchParticipantSnapshot participant(
			Optional<AscendantSnapshot> ascendant,
			List<CreatureCardSnapshot> cards) {
		return new MatchParticipantSnapshot(
				new PlayerSnapshot(God.ERA), new DeckSnapshot(ascendant, cards));
	}

	private static CreatureCardSnapshot creature(String name, SignType element, String planet, House house) {
		return new CreatureCardSnapshot(sign(name, element), planet(planet), house);
	}

	private static SignSnapshot sign(String name, SignType element) {
		return new SignSnapshot(name, element, 10, 10);
	}

	private static PlanetSnapshot planet(String name) {
		return new PlanetSnapshot(name, 5, 6);
	}
}