package com.l9_anagrams.game.domain;

import java.util.Objects;

public record Card(Sign sign, Planet planet, House house) {
	public Card {
		Objects.requireNonNull(sign, "Card sign is required");
		Objects.requireNonNull(planet, "Card planet is required");
		Objects.requireNonNull(house, "Card house is required");
	}

	public String label() {
		return sign.name() + " / " + planet.name() + " / Casa " + house;
	}
}