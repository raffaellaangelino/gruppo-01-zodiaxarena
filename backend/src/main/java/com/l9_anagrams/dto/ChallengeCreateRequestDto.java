package com.l9_anagrams.dto;

import jakarta.validation.constraints.NotNull;

public record ChallengeCreateRequestDto(
		@NotNull Long opponentId,
		@NotNull Long deckId) {
}
