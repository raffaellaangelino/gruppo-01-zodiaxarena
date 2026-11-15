package com.l9_anagrams.game.model;

import java.util.List;

public record GameResult(
		long seed,
		GameOutcome outcome,
		EndReason reason,
		int playerAPv,
		int playerBPv,
		int roundsPlayed,
		int playerACreaturesRemaining,
		int playerBCreaturesRemaining,
		int playerAResidualDefense,
		int playerBResidualDefense,
		String tieBreaker,
		List<GameEvent> log) {
	public GameResult {
		log = List.copyOf(log);
	}
}