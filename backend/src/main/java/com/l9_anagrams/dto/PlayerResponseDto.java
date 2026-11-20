package com.l9_anagrams.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.l9_anagrams.entity.Player;
import com.l9_anagrams.enums.God;

public record PlayerResponseDto(
		Long id,
		Long appUserId,
		String nickName,
		long credits,
		God god,
		LocalDateTime lastGodChange,
		int pityCounter,
		SignResponseDto sunSign,
		int cardCount,
		List<Long> deckIds,
		PlayerOnboardingDto onboarding) {

	public static PlayerResponseDto from(Player player) {
		return new PlayerResponseDto(
				player.getId(),
				player.getAppUser() != null ? player.getAppUser().getId() : null,
				player.getNickName(),
				player.getCredits(),
				player.getGod(),
				player.getLastGodChange(),
				player.getPityCounter(),
				player.getSunSign() != null ? SignResponseDto.from(player.getSunSign()) : null,
				player.getPlayerCards().size(),
				player.getDecks().stream().map(d -> d.getId()).toList(),
				new PlayerOnboardingDto(player.getOnboardingStep() == null, player.getOnboardingStep()));
	}
}