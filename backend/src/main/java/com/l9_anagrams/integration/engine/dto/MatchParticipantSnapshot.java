package com.l9_anagrams.integration.engine.dto;

import java.util.Objects;

public record MatchParticipantSnapshot(PlayerSnapshot player, DeckSnapshot deck) {
	public MatchParticipantSnapshot {
		Objects.requireNonNull(player, "Player snapshot is required");
		Objects.requireNonNull(deck, "Selected deck snapshot is required");
	}
}