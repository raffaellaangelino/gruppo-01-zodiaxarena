package com.l9_anagrams.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import com.l9_anagrams.enums.MatchOutcome;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ApiException;
import com.l9_anagrams.integration.engine.exception.EngineClientException;
import com.l9_anagrams.integration.engine.exception.EngineErrors;

/** Esiti e errori dell'engine tradotti per le API della sfida. */
class ChallengeEngineResultTest {

	@Test
	void mapsEngineGameOutcomeValues() {
		// Valori dell'enum GameOutcome dell'engine: A = sfidante, B = sfidato
		assertEquals(MatchOutcome.CHALLENGER_WIN, ChallengeService.mapOutcome("PLAYER_A_WINS"));
		assertEquals(MatchOutcome.CHALLENGED_WIN, ChallengeService.mapOutcome("PLAYER_B_WINS"));
		assertEquals(MatchOutcome.DRAW, ChallengeService.mapOutcome("DRAW"));
	}

	@Test
	void rejectsUnknownOutcome() {
		assertThrows(IllegalArgumentException.class, () -> ChallengeService.mapOutcome("SOMEONE_WINS"));
	}

	@Test
	void engineDeckRejectionBecomesDeckInvalid() {
		ApiException error = EngineErrors.toApiException(
				new EngineClientException(HttpStatus.BAD_REQUEST, "PLAYER2", "too many FIRE cards"));
		assertEquals(HttpStatus.UNPROCESSABLE_CONTENT, error.getStatus());
		assertEquals(ApiErrorCode.DECK_INVALID, error.getCode());
	}

	@Test
	void unreachableEngineBecomesEngineUnavailable() {
		ApiException error = EngineErrors.toApiException(
				new EngineClientException(HttpStatus.SERVICE_UNAVAILABLE, null, "Engine is unavailable"));
		assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.getStatus());
		assertEquals(ApiErrorCode.ENGINE_UNAVAILABLE, error.getCode());
	}

	@Test
	void badEngineResponseBecomesInvalidEngineResponse() {
		ApiException error = EngineErrors.toApiException(
				new EngineClientException(HttpStatus.BAD_GATEWAY, null, "Engine returned an empty response"));
		assertEquals(HttpStatus.BAD_GATEWAY, error.getStatus());
		assertEquals(ApiErrorCode.INVALID_ENGINE_RESPONSE, error.getCode());
	}
}
