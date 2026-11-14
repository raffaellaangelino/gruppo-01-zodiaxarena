package com.l9_anagrams.integration.engine.exception;

import java.util.Objects;

import org.springframework.http.HttpStatus;

public class EngineClientException extends RuntimeException {
	private final HttpStatus status;
	private final String player;

	public EngineClientException(HttpStatus status, String player, String message) {
		super(message);
		this.status = Objects.requireNonNull(status);
		this.player = player;
	}

	public HttpStatus status() {
		return status;
	}

	public String player() {
		return player;
	}
}