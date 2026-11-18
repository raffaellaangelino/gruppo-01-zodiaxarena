package com.l9_anagrams.dto;

public record OpponentStatsDto(int wins, int losses) {
	public static OpponentStatsDto empty() {
		return new OpponentStatsDto(0, 0);
	}
}
