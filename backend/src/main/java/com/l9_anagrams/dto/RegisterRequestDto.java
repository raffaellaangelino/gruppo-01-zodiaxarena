package com.l9_anagrams.dto;

import java.time.LocalDate;

import com.l9_anagrams.enums.God;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record RegisterRequestDto(
		@Email @NotBlank String email,
		@NotBlank @Size(min = 8, max = 72) String password,
		@NotBlank @Size(max = 16) String nickName,
		@Past LocalDate birthDate,
		@NotNull God god) {
}
