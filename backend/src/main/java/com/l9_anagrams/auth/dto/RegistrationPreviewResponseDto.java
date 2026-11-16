package com.l9_anagrams.auth.dto;

import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.God;

public record RegistrationPreviewResponseDto(
		String sunSign,
		SignType element,
		God proposedFaction,
		WelcomeCounts welcomeCounts) {

	public record WelcomeCounts(long credits, int creatureCards, int ascendants) {
	}
}