package com.l9_anagrams.enums;

import com.l9_anagrams.entity.CardDefinition;

/**
 * Rarità di una carta nei pacchetti.
 * Per le creature viene dalla tier del pianeta; gli Ascendenti (senza pianeta) hanno una rarità propria.
 */
public enum CardRarity {
	COMMON,
	RARE,
	EPIC,
	LEGENDARY,
	ASCENDANT;

	public static CardRarity of(CardDefinition card) {
		if (card.getType() == CardType.ASCENDANT) {
			return ASCENDANT;
		}
		return switch (card.getPlanet().getTier()) {
			case COMMON -> COMMON;
			case RARE -> RARE;
			case EPIC -> EPIC;
			case LEGENDARY -> LEGENDARY;
		};
	}
}
