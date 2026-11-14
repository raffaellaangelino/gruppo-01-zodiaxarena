package com.l9_anagrams.game.domain;

import java.util.Objects;

public record Sign(String name, Element element, int attack, int defense) {
	public Sign {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("Sign name is required");
		}
		Objects.requireNonNull(element, "Sign element is required");
		if (attack < 0 || defense < 0) {
			throw new IllegalArgumentException("Sign stats cannot be negative");
		}
	}
}