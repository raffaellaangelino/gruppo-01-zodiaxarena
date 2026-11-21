package com.l9_anagrams.exception;

import org.springframework.http.HttpStatus;

/**
 * Errore con stato HTTP e codice scelti da chi lo lancia (es. 503 ENGINE_UNAVAILABLE),
 * per i casi che non rientrano in ConflictException o RuleViolationException.
 */
public class ApiException extends RuntimeException {
	private final HttpStatus status;
	private final ApiErrorCode code;

	public ApiException(HttpStatus status, ApiErrorCode code, String message) {
		super(message);
		this.status = status;
		this.code = code;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public ApiErrorCode getCode() {
		return code;
	}
}
