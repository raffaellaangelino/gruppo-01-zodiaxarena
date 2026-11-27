package com.l9_anagrams.enums;

import com.l9_anagrams.entity.CardDefinition;

/**
 * Rarità di una carta nei pacchetti.
 * Per le creature viene dalla tier del pianeta; gli Ascendenti (senza pianeta) hanno una rarità propria.
 * Ogni rarità ha il suo valore di riciclo in crediti (Contratto API §4.4).
 */
public enum CardRarity {
	COMMON(5),
	RARE(10),
	EPIC(25),
	LEGENDARY(60),
	ASCENDANT(100);

	private final int recycleValue;

	CardRarity(int recycleValue) {
		this.recycleValue = recycleValue;
	}

	/** Crediti ottenuti riciclando una copia di questa rarità. */
	public int getRecycleValue() {
		return recycleValue;
	}

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
