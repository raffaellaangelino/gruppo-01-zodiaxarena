package com.l9_anagrams.dto;

import java.time.LocalDate;

import com.l9_anagrams.enums.God;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record PlayerRequestDto(
		@NotBlank @Size(max = 30) String nickName,
		@Past LocalDate birthDate,
		@NotNull God god) {
}