package com.l9_anagrams.dto;

import com.l9_anagrams.enums.God;

import jakarta.validation.constraints.NotNull;

public record FactionChoiceRequestDto(@NotNull God god) {
}