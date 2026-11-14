package com.l9_anagrams.integration.engine.dto;

import java.util.List;
import java.util.Optional;

public record DeckSnapshot(Optional<AscendantSnapshot> ascendant, List<CreatureCardSnapshot> cards) {
	public DeckSnapshot {
		ascendant = ascendant == null ? Optional.empty() : ascendant;
		cards = List.copyOf(cards);
	}
}