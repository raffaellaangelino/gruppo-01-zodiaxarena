package com.game;

public enum God {
	EFESTO(Element.FUOCO),
	POSEIDONE(Element.ACQUA),
	DEMETRA(Element.TERRA),
	ERA(Element.ARIA);

	private final Element element;

	God(Element element) {
		this.element = element;
	}

	public Element element() {
		return element;
	}
}