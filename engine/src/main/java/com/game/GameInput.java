package com.game;

import java.util.Objects;

public record GameInput(Player player1, Player player2, Long seed) {
	public GameInput {
		Objects.requireNonNull(player1, "Player A is required");
		Objects.requireNonNull(player2, "Player B is required");
	}
}
