package com.l9_anagrams.dto;

import java.time.LocalDateTime;
import java.util.Map;

import com.l9_anagrams.enums.God;

import tools.jackson.databind.JsonNode;

/**
 * Una partita giocata (forma ridotta per il SAL): il risultato dell'engine così com'è,
 * più i due giocatori e il lato di chi guarda.
 *
 * @param me      "A" se chi guarda è lo sfidante, "B" se è lo sfidato
 * @param players lato A (sfidante) e lato B (sfidato)
 * @param result  engine_payload: seed, outcome, reason, playerAPv, playerBPv, roundsPlayed, tieBreaker, log
 */
public record MatchResponseDto(
		Long id,
		String me,
		LocalDateTime playedAt,
		Map<String, MatchPlayerDto> players,
		JsonNode result) {

	/** god: la Fazione al momento della sfida (copia del mazzo), non quella attuale (D-015). */
	public record MatchPlayerDto(Long id, String nickname, God god) {
	}
}
