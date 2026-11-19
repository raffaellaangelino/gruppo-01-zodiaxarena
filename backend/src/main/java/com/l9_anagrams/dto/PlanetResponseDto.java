package com.l9_anagrams.dto;

import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.enums.PlanetTier;

public record PlanetResponseDto(
		Long id,
		String name,
		PlanetTier tier,
		int atk,
		int def) {
	public static PlanetResponseDto from(Planet planet) {
		return new PlanetResponseDto(
				planet.getId(),
				planet.getName(),
				planet.getTier(),
				planet.getAtk(),
				planet.getDef());
	}
}