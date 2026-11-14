package com.l9_anagrams.integration.engine.dto;

import java.util.Objects;

import com.l9_anagrams.entity.SignType;

public record SignSnapshot(String name, SignType element, int attack, int defense) {
	public SignSnapshot {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("Sign name is required");
		}
		Objects.requireNonNull(element, "Sign element is required");
	}
}