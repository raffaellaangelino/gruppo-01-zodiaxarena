package com.l9_anagrams.game.domain;

import java.util.Objects;

public record Ascendant(Sign sign) {
	public Ascendant {
		Objects.requireNonNull(sign, "Ascendant sign is required");
	}
}