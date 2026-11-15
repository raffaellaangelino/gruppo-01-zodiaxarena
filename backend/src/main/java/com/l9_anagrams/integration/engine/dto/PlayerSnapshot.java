package com.l9_anagrams.integration.engine.dto;

import java.util.Objects;

import com.l9_anagrams.enums.God;

public record PlayerSnapshot(God god) {
	public PlayerSnapshot {
		Objects.requireNonNull(god, "Player God is required");
	}
}