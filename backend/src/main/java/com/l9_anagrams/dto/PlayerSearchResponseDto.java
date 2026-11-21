package com.l9_anagrams.dto;

import java.util.List;

/** Risultato di GET /api/players/search: pendingChallengeId non nullo = sfida già in attesa tra i due. */
public record PlayerSearchResponseDto(List<Item> items) {

	public record Item(Long id, String nickname, Long pendingChallengeId) {
	}
}
