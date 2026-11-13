package com.game;

import org.springframework.stereotype.Service;

@Service
public class GameService {

	public GameResult playGame(GameInput gameInput) {
		return new Game(gameInput).play();
	}

}
