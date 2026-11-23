package com.l9_anagrams.auth.dto;

import com.l9_anagrams.dto.PlayerResponseDto;
import com.l9_anagrams.enums.God;

public record RegistrationResponseDto(String token, PlayerResponseDto player, God proposedFaction) {
}