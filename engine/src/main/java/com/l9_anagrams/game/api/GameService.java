package com.l9_anagrams.game.api;

import com.l9_anagrams.game.engine.Game;
import com.l9_anagrams.game.model.GameInput;
import com.l9_anagrams.game.model.GameResult;
import org.springframework.stereotype.Service;

@Service
public class GameService {

	public GameResult playGame(GameInput gameInput) {
		return new Game(gameInput).play();
	}

}
