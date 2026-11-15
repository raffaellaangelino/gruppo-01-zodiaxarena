package com.l9_anagrams.exception;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ErrorResponse> badCredentials(BadCredentialsException ex) {
		return build(HttpStatus.UNAUTHORIZED, "Credenziali non valide", List.of());
	}

	private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, List<String> details) {
		return ResponseEntity.status(status).body(new ErrorResponse(status.value(), message, details));
	}
}