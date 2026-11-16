package com.l9_anagrams.integration.engine.dto;

import java.util.Objects;

import com.l9_anagrams.enums.House;

public record CreatureCardSnapshot(SignSnapshot sign, PlanetSnapshot planet, House house) {
	public CreatureCardSnapshot {
		Objects.requireNonNull(sign, "Creature sign is required");
		Objects.requireNonNull(planet, "Creature planet is required");
		Objects.requireNonNull(house, "Creature House is required");
	}
}