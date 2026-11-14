package com.l9_anagrams.game.domain;

public enum Element {
	ACQUA,
	FUOCO,
	TERRA,
	ARIA;

	public boolean beats(Element other) {
		return switch (this) {
			case ACQUA -> other == FUOCO;
			case FUOCO -> other == TERRA;
			case TERRA -> other == ARIA;
			case ARIA -> other == ACQUA;
		};
	}
}