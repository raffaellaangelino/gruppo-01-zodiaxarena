package com.l9_anagrams.dto;

import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.entity.SignType;

public record SignResponseDto(
		Long id,
		String name,
		SignType type,
		int atk,
		int def) {
	public static SignResponseDto from(Sign sign) {
		return new SignResponseDto(
				sign.getId(),
				sign.getName(),
				sign.getType(),
				sign.getAtk(),
				sign.getDef());
	}
}