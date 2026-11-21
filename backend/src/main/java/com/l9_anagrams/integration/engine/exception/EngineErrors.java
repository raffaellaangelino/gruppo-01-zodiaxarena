package com.l9_anagrams.integration.engine.exception;

import org.springframework.http.HttpStatus;

import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ApiException;

/** Traduce gli errori dell'engine nel formato d'errore delle API (contratto §1.2, §7.3). */
public final class EngineErrors {
	private EngineErrors() {
	}

	/**
	 * 400 dell'engine (mazzo rifiutato) → 422 DECK_INVALID con il motivo dell'engine;
	 * risposta illeggibile → 502 INVALID_ENGINE_RESPONSE; tutto il resto → 503 ENGINE_UNAVAILABLE.
	 */
	public static ApiException toApiException(EngineClientException exception) {
		if (exception.status() == HttpStatus.BAD_REQUEST) {
			String who = exception.player() == null ? "" : exception.player() + ": ";
			return new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, ApiErrorCode.DECK_INVALID,
					who + exception.getMessage());
		}
		if (exception.status() == HttpStatus.BAD_GATEWAY) {
			return invalidResponse(exception.getMessage());
		}
		return new ApiException(HttpStatus.SERVICE_UNAVAILABLE, ApiErrorCode.ENGINE_UNAVAILABLE,
				exception.getMessage());
	}

	public static ApiException invalidResponse(String message) {
		return new ApiException(HttpStatus.BAD_GATEWAY, ApiErrorCode.INVALID_ENGINE_RESPONSE, message);
	}
}
