package com.l9_anagrams.enums;

/**
 * Cosa esce in uno slot del pacchetto: una rarità fissa oppure la Stella,
 * la cui rarità si tira con le probabilità del pacchetto (PackStarOdds).
 */
public enum PackSlotType {
	COMMON(CardRarity.COMMON),
	RARE(CardRarity.RARE),
	EPIC(CardRarity.EPIC),
	LEGENDARY(CardRarity.LEGENDARY),
	ASCENDANT(CardRarity.ASCENDANT),
	STAR(null);

	private final CardRarity fixedRarity;

	PackSlotType(CardRarity fixedRarity) {
		this.fixedRarity = fixedRarity;
	}

	/** Rarità garantita dallo slot; null per la Stella. */
	public CardRarity fixedRarity() {
		return fixedRarity;
	}

	public boolean isStar() {
		return this == STAR;
	}
}
