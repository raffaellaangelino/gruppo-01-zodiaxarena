package com.l9_anagrams.game.model;

import com.l9_anagrams.game.domain.Player;
import java.util.Objects;
import java.util.Optional;

public record GameInput(Player player1, Player player2, Optional<Long> seed) {
	public GameInput {
		Objects.requireNonNull(player1, "Player A is required");
		Objects.requireNonNull(player2, "Player B is required");
		seed = seed == null ? Optional.empty() : seed;
	}
}
