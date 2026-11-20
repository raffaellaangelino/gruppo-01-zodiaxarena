package com.l9_anagrams.auth.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;

public record RegistrationPreviewRequestDto(
		@NotNull @Past LocalDate birthDate) {
}