package com.l9_anagrams.service;

import com.l9_anagrams.auth.dto.NicknameAvailabilityResponseDto;
import com.l9_anagrams.auth.dto.RegisterRequestDto;
import com.l9_anagrams.auth.dto.RegistrationPreviewResponseDto;
import com.l9_anagrams.dto.PlayerResponseDto;
import com.l9_anagrams.enums.God;

import java.time.LocalDate;

public interface RegistrationService {
	RegistrationResult register(RegisterRequestDto request);

	RegistrationPreviewResponseDto preview(LocalDate birthDate);

	NicknameAvailabilityResponseDto checkNicknameAvailability(String nickname);

	record RegistrationResult(PlayerResponseDto player, God proposedFaction, String email) {
	}
}