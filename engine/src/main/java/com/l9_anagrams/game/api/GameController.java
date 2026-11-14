package com.l9_anagrams.game.api;

import com.l9_anagrams.game.model.GameInput;
import com.l9_anagrams.game.model.GameResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/play-game")
public class GameController {

	private final GameService gameService;

	GameController(GameService gameService) {
		this.gameService = gameService;
	}

	@PostMapping("")
	public ResponseEntity<GameResult> playGame(@RequestBody GameInput gameInput) {
		return ResponseEntity.ok(gameService.playGame(gameInput));
	}

}
