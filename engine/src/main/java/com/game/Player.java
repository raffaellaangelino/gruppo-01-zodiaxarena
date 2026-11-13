package com.game;

import java.util.List;
import java.util.Objects;

public record Player(God god, Ascendant ascendant, List<Card> cards) {
	public Player {
		Objects.requireNonNull(god, "Player god is required");
		Objects.requireNonNull(ascendant, "Player ascendant is required");
		cards = List.copyOf(Objects.requireNonNull(cards, "Player cards are required"));
		if (cards.stream().anyMatch(Objects::isNull)) {
			throw new IllegalArgumentException("Player cards cannot contain null");
		}
	}
}