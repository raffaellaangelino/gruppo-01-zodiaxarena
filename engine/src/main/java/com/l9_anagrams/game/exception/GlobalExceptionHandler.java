package com.l9_anagrams.game.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(IllegalDeckException.class)
	public ResponseEntity<DeckValidationError> handleIllegalDeck(IllegalDeckException exception) {
		DeckValidationError error = new DeckValidationError(exception.deckOwner(), exception.getMessage());
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
	}
}