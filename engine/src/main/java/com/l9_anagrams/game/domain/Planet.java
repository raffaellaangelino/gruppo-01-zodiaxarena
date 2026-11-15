package com.l9_anagrams.game.domain;

public record Planet(String name, int attackBonus, int defenseBonus) {
	public Planet {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("Planet name is required");
		}
		if (attackBonus < 0 || defenseBonus < 0) {
			throw new IllegalArgumentException("Planet bonuses cannot be negative");
		}
	}
}