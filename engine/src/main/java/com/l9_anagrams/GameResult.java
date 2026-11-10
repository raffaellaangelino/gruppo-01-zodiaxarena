package com.l9_anagrams;

import java.util.List;

public record GameResult(
		long seed, // stored so the game can be replayed
		List<PlayerSummary> players, // god + deck order after shuffle, per player
		List<RoundLog> rounds, // round 0 = setup (shuffle, Ascendant)
		Outcome outcome) {
}