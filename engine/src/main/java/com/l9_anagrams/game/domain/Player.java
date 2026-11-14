package com.l9_anagrams.game.domain;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

public record Player(God god, Optional<Ascendant> ascendant, List<Card> cards) {
	public Player {
		Objects.requireNonNull(god, "Player god is required");
		ascendant = ascendant == null ? Optional.empty() : ascendant;
		cards = List.copyOf(Objects.requireNonNull(cards, "Player cards are required"));
	}
}