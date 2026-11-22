package com.l9_anagrams.service;

import static com.l9_anagrams.service.PackTestData.COSTELLAZIONE;
import static com.l9_anagrams.service.PackTestData.LAUNCH_ODDS;
import static com.l9_anagrams.service.PackTestData.LUNA_PIENA;
import static com.l9_anagrams.service.PackTestData.ZENIT;
import static com.l9_anagrams.service.PackTestData.launchCatalog;
import static com.l9_anagrams.service.PackTestData.odds;
import static com.l9_anagrams.service.PackTestData.slots;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.SplittableRandom;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.PackSlotType;
import com.l9_anagrams.service.PackDrawer.DrawResult;
import com.l9_anagrams.service.PackDrawer.DrawnCard;

class PackDrawerTest {

	private final PackDrawer drawer = new PackDrawer();
	private final Map<CardRarity, List<CardDefinition>> catalog = launchCatalog();

	// Stella che dà sempre una Rara / sempre un'Epica: rende deterministici i test sul resto
	private static final Map<CardRarity, BigDecimal> ALWAYS_RARE = odds("1", "0", "0", "0");
	private static final Map<CardRarity, BigDecimal> ALWAYS_EPIC = odds("0", "1", "0", "0");

	@Test
	void packsHaveTheirSizeAndFixedSlotsGiveTheirRarity() {
		for (List<PackSlotType> types : List.of(COSTELLAZIONE, ZENIT, LUNA_PIENA)) {
			DrawResult result = draw(types, LAUNCH_ODDS, Set.of(), 0, 7);
			assertEquals(types.size(), result.cards().size());
			for (int i = 0; i < types.size(); i++) {
				DrawnCard card = result.cards().get(i);
				assertEquals(i + 1, card.slotNumber());
				assertEquals(types.get(i), card.slotType());
				if (!card.slotType().isStar()) {
					assertEquals(card.slotType().fixedRarity(), CardRarity.of(card.card()));
				}
			}
			assertEquals(PackSlotType.STAR, result.cards().getLast().slotType());
		}
		assertEquals(5, COSTELLAZIONE.size());
		assertEquals(10, ZENIT.size());
		assertEquals(12, LUNA_PIENA.size());
	}

	@Test
	void tenthStarIsAlwaysLegendaryAndResetsCounter() {
		for (int seed = 0; seed < 50; seed++) {
			DrawResult result = draw(COSTELLAZIONE, ALWAYS_RARE, Set.of(), 9, seed);
			assertEquals(CardRarity.LEGENDARY, CardRarity.of(result.cards().getLast().card()));
			assertEquals(0, result.pityAfter());
			assertTrue(result.sunFound());
		}
	}

	@Test
	void starWithoutLegendaryRaisesCounterAndFixedSlotsDoNot() {
		// Luna Piena: 11 slot fissi e una Stella → il contatore sale di 1, non di 12
		DrawResult result = draw(LUNA_PIENA, ALWAYS_RARE, Set.of(), 3, 1);
		assertEquals(4, result.pityAfter());
		assertFalse(result.sunFound());
	}

	@Test
	void epicIsNotDuplicatedWhileSomeAreMissing() {
		List<CardDefinition> epics = catalog.get(CardRarity.EPIC);
		CardDefinition missing = epics.get(5);
		Set<Long> owned = epics.stream()
				.filter(card -> card != missing)
				.map(CardDefinition::getId)
				.collect(Collectors.toSet());
		for (int seed = 0; seed < 50; seed++) {
			DrawResult result = draw(ZENIT, ALWAYS_RARE, owned, 0, seed);
			assertEquals(missing.getId(), result.cards().get(8).card().getId()); // slot 9: Epica
		}
	}

	@Test
	void epicCanRepeatWhenAllAreOwned() {
		Set<Long> owned = catalog.get(CardRarity.EPIC).stream().map(CardDefinition::getId).collect(Collectors.toSet());
		DrawResult result = draw(ZENIT, ALWAYS_RARE, owned, 0, 3);
		assertTrue(owned.contains(result.cards().get(8).card().getId()));
	}

	@Test
	void twoEpicsInTheSamePackAreDifferent() {
		for (int seed = 0; seed < 200; seed++) {
			DrawResult result = draw(LUNA_PIENA, ALWAYS_EPIC, Set.of(), 0, seed);
			assertNotEquals(
					result.cards().get(9).card().getId(), // slot 10: Epica fissa
					result.cards().get(11).card().getId()); // slot 12: Stella Epica
		}
	}

	@Test
	void starFollowsLaunchOdds() {
		int draws = 100_000;
		Map<CardRarity, Integer> counts = new EnumMap<>(CardRarity.class);
		SplittableRandom random = new SplittableRandom(42);
		for (int i = 0; i < draws; i++) {
			// Pity sempre 0 e nessuna carta posseduta: conta solo il tiro della Stella
			DrawResult result = drawer.draw(slots(List.of(PackSlotType.STAR)), LAUNCH_ODDS, catalog, Set.of(), 0, random);
			counts.merge(CardRarity.of(result.cards().getFirst().card()), 1, Integer::sum);
		}
		assertShare(0.60, counts.get(CardRarity.RARE), draws);
		assertShare(0.30, counts.get(CardRarity.EPIC), draws);
		assertShare(0.08, counts.get(CardRarity.LEGENDARY), draws);
		assertShare(0.02, counts.get(CardRarity.ASCENDANT), draws);
		assertFalse(counts.containsKey(CardRarity.COMMON));
	}

	private DrawResult draw(List<PackSlotType> types, Map<CardRarity, BigDecimal> odds, Set<Long> owned, int pity,
			long seed) {
		return drawer.draw(slots(types), odds, catalog, owned, pity, new SplittableRandom(seed));
	}

	private static void assertShare(double expected, Integer count, int total) {
		double share = (count == null ? 0 : count) / (double) total;
		assertEquals(expected, share, 0.01, "quota attesa " + expected + ", ottenuta " + share);
	}
}
