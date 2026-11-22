package com.l9_anagrams;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import org.junit.jupiter.api.Test;

import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.PackDefinition;
import com.l9_anagrams.entity.PackOpeningCard;
import com.l9_anagrams.entity.PackSlot;
import com.l9_anagrams.entity.PackStarOdds;
import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.PackSlotType;
import com.l9_anagrams.enums.PlanetTier;

/** Rarità da pacchetto e tipi di slot. */
class PackEnumsTest {

	private static final Sign ARIETE = new Sign("Ariete", SignType.FIRE, 13, 7);

	@Test
	void creatureRarityComesFromPlanetTier() {
		assertEquals(CardRarity.COMMON, rarityOf(new Planet("Mercurio", PlanetTier.COMMON, 0, 2)));
		assertEquals(CardRarity.RARE, rarityOf(new Planet("Giove", PlanetTier.RARE, 2, 4)));
		assertEquals(CardRarity.EPIC, rarityOf(new Planet("Luna", PlanetTier.EPIC, 6, 5)));
		assertEquals(CardRarity.LEGENDARY, rarityOf(new Planet("Sole", PlanetTier.LEGENDARY, 8, 9)));
	}

	@Test
	void ascendantHasItsOwnRarity() {
		assertEquals(CardRarity.ASCENDANT, CardRarity.of(new CardDefinition(ARIETE, "asc.png")));
	}

	@Test
	void fixedSlotsGiveTheirRarityAndStarIsRolled() {
		assertEquals(CardRarity.COMMON, PackSlotType.COMMON.fixedRarity());
		assertEquals(CardRarity.ASCENDANT, PackSlotType.ASCENDANT.fixedRarity());
		assertNull(PackSlotType.STAR.fixedRarity());
		assertTrue(PackSlotType.STAR.isStar());
	}

	@Test
	void packEnumsAreStoredByName() throws ReflectiveOperationException {
		assertStringEnum(PackDefinition.class, "purchaseLimit");
		assertStringEnum(PackSlot.class, "slotType");
		assertStringEnum(PackStarOdds.class, "rarity");
		assertStringEnum(PackOpeningCard.class, "slotType");
	}

	private static CardRarity rarityOf(Planet planet) {
		return CardRarity.of(new CardDefinition(ARIETE, planet, "card.png"));
	}

	private static void assertStringEnum(Class<?> type, String field) throws ReflectiveOperationException {
		assertEquals(EnumType.STRING, type.getDeclaredField(field).getAnnotation(Enumerated.class).value());
	}
}
