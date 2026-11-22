package com.l9_anagrams.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.PackDefinition;
import com.l9_anagrams.entity.PackSlot;
import com.l9_anagrams.entity.PackStarOdds;
import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.PackSlotType;
import com.l9_anagrams.enums.PlanetTier;

/** Catalogo e pacchetti finti per i test del Negozio (stessa forma del seed). */
final class PackTestData {

	static final Sign SIGN = new Sign("Ariete", SignType.FIRE, 13, 7);

	static final List<PackSlotType> COSTELLAZIONE = slotTypes(3, 1, 0, 0);
	static final List<PackSlotType> ZENIT = slotTypes(6, 2, 1, 0);
	static final List<PackSlotType> LUNA_PIENA = slotTypes(6, 3, 1, 1);

	static final Map<CardRarity, BigDecimal> LAUNCH_ODDS = odds("0.60", "0.30", "0.08", "0.02");

	private PackTestData() {
	}

	/** 24 Comuni, 24 Rare, 24 Epiche, 12 Leggendarie, 12 Ascendenti, con id progressivi. */
	static Map<CardRarity, List<CardDefinition>> launchCatalog() {
		Map<CardRarity, List<CardDefinition>> pool = new EnumMap<>(CardRarity.class);
		long[] nextId = { 1 };
		pool.put(CardRarity.COMMON, creatures(PlanetTier.COMMON, 24, nextId));
		pool.put(CardRarity.RARE, creatures(PlanetTier.RARE, 24, nextId));
		pool.put(CardRarity.EPIC, creatures(PlanetTier.EPIC, 24, nextId));
		pool.put(CardRarity.LEGENDARY, creatures(PlanetTier.LEGENDARY, 12, nextId));
		List<CardDefinition> ascendants = new ArrayList<>();
		for (int i = 0; i < 12; i++) {
			ascendants.add(withId(new CardDefinition(SIGN, "asc.png"), nextId[0]++));
		}
		pool.put(CardRarity.ASCENDANT, ascendants);
		return pool;
	}

	static List<CardDefinition> creatures(PlanetTier tier, int count, long[] nextId) {
		Planet planet = new Planet(tier.name(), tier, 1, 1);
		List<CardDefinition> cards = new ArrayList<>();
		for (int i = 0; i < count; i++) {
			cards.add(withId(new CardDefinition(SIGN, planet, "card.png"), nextId[0]++));
		}
		return cards;
	}

	static CardDefinition withId(CardDefinition card, long id) {
		card.setId(id);
		return card;
	}

	static List<PackSlot> slots(List<PackSlotType> types) {
		List<PackSlot> slots = new ArrayList<>();
		for (int i = 0; i < types.size(); i++) {
			PackSlot slot = new PackSlot();
			slot.setSlotNumber(i + 1);
			slot.setSlotType(types.get(i));
			slots.add(slot);
		}
		return slots;
	}

	static PackDefinition pack(String code, int price, List<PackSlotType> types, Map<CardRarity, BigDecimal> odds) {
		PackDefinition pack = new PackDefinition();
		pack.setId((long) code.hashCode());
		pack.setCode(code);
		pack.setName(code);
		pack.setPrice(price);
		for (PackSlot slot : slots(types)) {
			slot.setPack(pack);
			pack.getSlots().add(slot);
		}
		odds.forEach((rarity, probability) -> {
			PackStarOdds row = new PackStarOdds();
			row.setPack(pack);
			row.setRarity(rarity);
			row.setProbability(probability);
			pack.getStarOdds().add(row);
		});
		return pack;
	}

	/** Probabilità della Stella nell'ordine RARE, EPIC, LEGENDARY, ASCENDANT. */
	static Map<CardRarity, BigDecimal> odds(String rare, String epic, String legendary, String ascendant) {
		Map<CardRarity, BigDecimal> odds = new EnumMap<>(CardRarity.class);
		odds.put(CardRarity.RARE, new BigDecimal(rare));
		odds.put(CardRarity.EPIC, new BigDecimal(epic));
		odds.put(CardRarity.LEGENDARY, new BigDecimal(legendary));
		odds.put(CardRarity.ASCENDANT, new BigDecimal(ascendant));
		return odds;
	}

	private static List<PackSlotType> slotTypes(int commons, int rares, int epics, int ascendants) {
		List<PackSlotType> types = new ArrayList<>();
		types.addAll(java.util.Collections.nCopies(commons, PackSlotType.COMMON));
		types.addAll(java.util.Collections.nCopies(rares, PackSlotType.RARE));
		types.addAll(java.util.Collections.nCopies(epics, PackSlotType.EPIC));
		types.addAll(java.util.Collections.nCopies(ascendants, PackSlotType.ASCENDANT));
		types.add(PackSlotType.STAR);
		return List.copyOf(types);
	}
}
