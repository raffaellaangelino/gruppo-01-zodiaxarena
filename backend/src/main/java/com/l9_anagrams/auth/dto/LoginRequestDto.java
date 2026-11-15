package com.l9_anagrams.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto(
		@NotBlank String email,
		@NotBlank String password) {
}
