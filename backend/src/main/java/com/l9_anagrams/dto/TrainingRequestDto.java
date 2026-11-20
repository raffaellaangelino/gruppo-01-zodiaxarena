package com.l9_anagrams.dto;

import jakarta.validation.constraints.NotNull;

public record TrainingRequestDto(@NotNull Long deckId) {
}
