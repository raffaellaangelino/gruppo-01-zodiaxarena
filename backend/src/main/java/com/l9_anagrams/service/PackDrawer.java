package com.l9_anagrams.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.random.RandomGenerator;

import org.springframework.stereotype.Component;

import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.PackSlot;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.PackSlotType;

/**
 * Pesca delle carte di un pacchetto. Nessun accesso al DB: riceve catalogo, carte possedute
 * e generatore casuale, così si prova con un seme fisso.
 *
 * Regole:
 * - slot fisso: una carta della sua rarità;
 * - Stella: rarità tirata con le probabilità del pacchetto; dopo 9 Stelle senza Leggendaria
 *   la decima è Leggendaria (Sole garantito). Leggendaria azzera il contatore, il resto lo aumenta;
 * - Epiche e Leggendarie non escono doppie finché il giocatore non le ha tutte.
 */
@Component
public class PackDrawer {

	/** Il Sole è garantito entro questo numero di Stelle. */
	public static final int SUN_GUARANTEE_STARS = 10;

	// Ordine fisso del tiro cumulativo: il risultato non dipende dall'ordine delle righe nel DB
	private static final List<CardRarity> STAR_ORDER = List.of(
			CardRarity.RARE, CardRarity.EPIC, CardRarity.LEGENDARY, CardRarity.ASCENDANT);

	private static final Set<CardRarity> NO_DUPLICATES = EnumSet.of(CardRarity.EPIC, CardRarity.LEGENDARY);

	public DrawResult draw(
			List<PackSlot> slots,
			Map<CardRarity, BigDecimal> starOdds,
			Map<CardRarity, List<CardDefinition>> pool,
			Set<Long> ownedIds,
			int pityCounter,
			RandomGenerator random) {
		List<PackSlot> ordered = slots.stream()
				.sorted(Comparator.comparingInt(PackSlot::getSlotNumber))
				.toList();

		List<DrawnCard> cards = new ArrayList<>(ordered.size());
		Set<Long> drawnIds = new HashSet<>();
		int pity = pityCounter;
		boolean sunFound = false;

		for (PackSlot slot : ordered) {
			CardRarity rarity;
			if (slot.getSlotType().isStar()) {
				rarity = pity >= SUN_GUARANTEE_STARS - 1 ? CardRarity.LEGENDARY : rollStar(starOdds, random);
				if (rarity == CardRarity.LEGENDARY) {
					pity = 0;
					sunFound = true;
				} else {
					pity++;
				}
			} else {
				rarity = slot.getSlotType().fixedRarity();
			}
			CardDefinition card = pick(rarity, pool, ownedIds, drawnIds, random);
			drawnIds.add(card.getId());
			cards.add(new DrawnCard(slot.getSlotNumber(), slot.getSlotType(), card));
		}
		return new DrawResult(cards, pity, sunFound);
	}

	private CardRarity rollStar(Map<CardRarity, BigDecimal> starOdds, RandomGenerator random) {
		double roll = random.nextDouble();
		double cumulative = 0;
		CardRarity last = null;
		for (CardRarity rarity : STAR_ORDER) {
			BigDecimal probability = starOdds.getOrDefault(rarity, BigDecimal.ZERO);
			if (probability.signum() <= 0) {
				continue;
			}
			cumulative += probability.doubleValue();
			last = rarity;
			if (roll < cumulative) {
				return rarity;
			}
		}
		if (last == null) {
			throw new IllegalStateException("La Stella non ha probabilità configurate");
		}
		// Arrotondamenti dei double: il tiro resta nell'ultima rarità possibile
		return last;
	}

	private CardDefinition pick(
			CardRarity rarity,
			Map<CardRarity, List<CardDefinition>> pool,
			Set<Long> ownedIds,
			Set<Long> drawnIds,
			RandomGenerator random) {
		List<CardDefinition> all = pool.getOrDefault(rarity, List.of());
		if (all.isEmpty()) {
			throw new IllegalStateException("Nessuna carta " + rarity + " nel catalogo");
		}
		List<CardDefinition> candidates = all;
		if (NO_DUPLICATES.contains(rarity)) {
			List<CardDefinition> missing = all.stream()
					.filter(card -> !ownedIds.contains(card.getId()) && !drawnIds.contains(card.getId()))
					.toList();
			if (!missing.isEmpty()) {
				candidates = missing;
			} else {
				// Le ha tutte: si pesca tra tutte, evitando se possibile di ripetere nello stesso pacchetto
				List<CardDefinition> notInPack = all.stream()
						.filter(card -> !drawnIds.contains(card.getId()))
						.toList();
				candidates = notInPack.isEmpty() ? all : notInPack;
			}
		}
		return candidates.get(random.nextInt(candidates.size()));
	}

	public record DrawResult(List<DrawnCard> cards, int pityAfter, boolean sunFound) {
	}

	public record DrawnCard(int slotNumber, PackSlotType slotType, CardDefinition card) {
	}
}
