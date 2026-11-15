package com.l9_anagrams.integration.engine.dto;

public record PlanetSnapshot(String name, int attackBonus, int defenseBonus) {
	public PlanetSnapshot {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("Planet name is required");
		}
	}
}