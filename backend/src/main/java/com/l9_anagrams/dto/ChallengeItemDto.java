package com.l9_anagrams.dto;

import java.time.LocalDateTime;

import com.l9_anagrams.entity.Challenge;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.enums.ChallengeCancelReason;
import com.l9_anagrams.enums.ChallengeStatus;

public record ChallengeItemDto(
		Long id,
		ChallengeStatus status,
		String direction,
		PlayerReferenceDto opponent,
		LocalDateTime createdAt,
		LocalDateTime expiresAt,
		boolean rewarded,
		Long matchId,
		ChallengeCancelReason cancelReason) {
	public static ChallengeItemDto from(Challenge challenge, Player opponent, String direction) {
		Long matchId = challenge.getMatch() == null ? null : challenge.getMatch().getId();
		return new ChallengeItemDto(
				challenge.getId(),
				challenge.getStatus(),
				direction,
				PlayerReferenceDto.from(opponent),
				challenge.getCreatedAt(),
				challenge.getExpiresAt(),
				false,
				matchId,
				challenge.getCancelReason());
	}
}
