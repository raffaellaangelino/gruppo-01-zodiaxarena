package com.l9_anagrams.integration.engine.dto;

import java.util.Objects;

public record AscendantSnapshot(SignSnapshot sign) {
	public AscendantSnapshot {
		Objects.requireNonNull(sign, "Ascendant sign is required");
	}
}