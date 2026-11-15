package com.l9_anagrams.game.exception;

import java.util.Objects;

public final class IllegalDeckException extends RuntimeException {
	private final DeckOwner deckOwner;

	public IllegalDeckException(DeckOwner deckOwner, String message) {
		super(message);
		this.deckOwner = Objects.requireNonNull(deckOwner, "Deck owner is required");
	}

	public DeckOwner deckOwner() {
		return deckOwner;
	}
}