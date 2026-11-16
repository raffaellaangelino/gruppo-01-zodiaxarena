package com.l9_anagrams.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Il client invia solo id: i controlli sulle carte li fa il server. */
public record DeckRequestDto(
		@NotBlank @Size(max = 50) String name,
		@NotNull Long ascendantId,
		@NotNull List<Long> playerCardIds) {
}