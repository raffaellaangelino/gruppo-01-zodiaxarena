package com.l9_anagrams.exception;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	public record ErrorResponse(int status, String message, List<String> details) {
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> notFound(ResourceNotFoundException ex) {
		return build(HttpStatus.NOT_FOUND, ex.getMessage(), List.of());
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<ErrorResponse> conflict(ConflictException ex) {
		return build(HttpStatus.CONFLICT, ex.getMessage(), List.of());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErrorResponse> integrity(DataIntegrityViolationException ex) {
		return build(HttpStatus.CONFLICT, "Operazione in conflitto con dati esistenti", List.of());
	}

	@ExceptionHandler(RuleViolationException.class)
	public ResponseEntity<ErrorResponse> rules(RuleViolationException ex) {
		return build(HttpStatus.UNPROCESSABLE_ENTITY, "Regole del gioco violate", ex.getViolations());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex) {
		List<String> details = ex.getBindingResult().getFieldErrors().stream()
				.map(f -> f.getField() + ": " + f.getDefaultMessage())
				.toList();
		return build(HttpStatus.BAD_REQUEST, "Dati non validi", details);
	}

	/** Corpo JSON assente o non leggibile (contratto: 400 VALIDATION_ERROR). */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> unreadable(HttpMessageNotReadableException ex) {
		return build(HttpStatus.BAD_REQUEST, "JSON non leggibile", List.of());
	}

	/** Due salvataggi contemporanei della stessa riga (@Version, ad esempio sul Deck). */
	@ExceptionHandler(ObjectOptimisticLockingFailureException.class)
	public ResponseEntity<ErrorResponse> optimisticLock(ObjectOptimisticLockingFailureException ex) {
		return build(HttpStatus.CONFLICT, "Dati modificati da un'altra richiesta: ricarica e riprova", List.of());
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ErrorResponse> badCredentials(BadCredentialsException ex) {
		return build(HttpStatus.UNAUTHORIZED, "Credenziali non valide", List.of());
	}

	private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, List<String> details) {
		return ResponseEntity.status(status).body(new ErrorResponse(status.value(), message, details));
	}
}