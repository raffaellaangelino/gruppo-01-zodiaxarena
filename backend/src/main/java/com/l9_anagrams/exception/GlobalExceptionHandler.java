package com.l9_anagrams.exception;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiErrorResponse> notFound(ResourceNotFoundException exception) {
		return build(HttpStatus.NOT_FOUND, ApiErrorCode.RESOURCE_NOT_FOUND, exception.getMessage(), Map.of());
	}

	@ExceptionHandler(ConflictException.class)
	public ResponseEntity<ApiErrorResponse> conflict(ConflictException exception) {
		return build(HttpStatus.CONFLICT, exception.getCode(), exception.getMessage(), Map.of());
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ApiErrorResponse> integrity(DataIntegrityViolationException exception) {
		return build(HttpStatus.CONFLICT, ApiErrorCode.CONFLICT,
				"Operation conflicts with existing data", Map.of());
	}

	@ExceptionHandler(RuleViolationException.class)
	public ResponseEntity<ApiErrorResponse> rules(RuleViolationException exception) {
		return build(HttpStatus.UNPROCESSABLE_ENTITY, ApiErrorCode.RULE_VIOLATION,
				"Game rules violated", Map.of("rules", exception.getViolations()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorResponse> validation(MethodArgumentNotValidException exception) {
		Map<String, List<String>> fieldErrors = exception.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.groupingBy(
						fieldError -> fieldError.getField(),
						LinkedHashMap::new,
						Collectors.mapping(fieldError -> fieldError.getDefaultMessage(),
								Collectors.toList())));
		return build(HttpStatus.BAD_REQUEST, ApiErrorCode.VALIDATION_ERROR,
				"Request validation failed", fieldErrors);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiErrorResponse> unreadableRequest(HttpMessageNotReadableException exception) {
		return build(HttpStatus.BAD_REQUEST, ApiErrorCode.BAD_REQUEST,
				"Request body is missing or malformed", Map.of());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiErrorResponse> invalidArgument(IllegalArgumentException exception) {
		return build(HttpStatus.BAD_REQUEST, ApiErrorCode.VALIDATION_ERROR, exception.getMessage(), Map.of());
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiErrorResponse> badCredentials(BadCredentialsException exception) {
		return build(HttpStatus.UNAUTHORIZED, ApiErrorCode.INVALID_CREDENTIALS,
				"Invalid credentials", Map.of());
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiErrorResponse> accessDenied(AccessDeniedException exception) {
		return build(HttpStatus.FORBIDDEN, ApiErrorCode.FORBIDDEN, "Access denied", Map.of());
	}

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<ApiErrorResponse> responseStatus(ResponseStatusException exception) {
		HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
		return build(status, ApiErrorController.codeFor(status), exception.getReason(), Map.of());
	}

	private ResponseEntity<ApiErrorResponse> build(
			HttpStatus status,
			ApiErrorCode code,
			String message,
			Map<String, List<String>> fieldErrors) {
		return ResponseEntity.status(status)
				.body(new ApiErrorResponse(status.value(), code.name(), message, fieldErrors));
	}
}