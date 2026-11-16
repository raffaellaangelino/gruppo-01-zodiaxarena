package com.l9_anagrams.integration.engine.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class EngineClientAdvice {
	@ExceptionHandler(EngineClientException.class)
	public ResponseEntity<EngineClientError> handleEngineClientException(EngineClientException exception) {
		EngineClientError error = new EngineClientError(exception.player(), exception.getMessage());
		return ResponseEntity.status(exception.status()).body(error);
	}
}