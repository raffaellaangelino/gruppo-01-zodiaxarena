package com.l9_anagrams.auth.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

public record RegisterRequestDto(
		@Email @NotBlank String email,
		@NotBlank @jakarta.validation.constraints.Size(min = 8, max = 72) String password,
		@NotBlank @Pattern(regexp = "^[A-Za-z0-9_]{3,16}$") String nickName,
		@NotNull @Past LocalDate birthDate,
		@AssertTrue boolean acceptedTerms,
		@AssertTrue boolean ageConfirmed) {
}
