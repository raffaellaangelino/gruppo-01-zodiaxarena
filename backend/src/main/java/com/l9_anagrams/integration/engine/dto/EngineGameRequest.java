package com.l9_anagrams.integration.engine.dto;

import java.util.List;
import java.util.Optional;

import com.l9_anagrams.enums.God;
import com.l9_anagrams.enums.House;

public record EngineGameRequest(EnginePlayer player1, EnginePlayer player2, Optional<Long> seed) {
	public EngineGameRequest {
		seed = seed == null ? Optional.empty() : seed;
	}

	public record EnginePlayer(God god, Optional<EngineAscendant> ascendant, List<EngineCard> cards) {
		public EnginePlayer {
			ascendant = ascendant == null ? Optional.empty() : ascendant;
			cards = List.copyOf(cards);
		}
	}

	public record EngineAscendant(EngineSign sign) {
	}

	public record EngineCard(EngineSign sign, EnginePlanet planet, House house) {
	}

	public record EngineSign(String name, EngineElement element, int attack, int defense) {
	}

	public record EnginePlanet(String name, int attackBonus, int defenseBonus) {
	}
}