package com.l9_anagrams.exception;

import java.util.Map;

import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ApiErrorController implements ErrorController {
	@RequestMapping("/error")
	public ResponseEntity<ApiErrorResponse> error(HttpServletRequest request) {
		Object statusAttribute = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
		int statusValue = statusAttribute instanceof Integer value ? value
				: HttpStatus.INTERNAL_SERVER_ERROR.value();
		HttpStatus status = HttpStatus.resolve(statusValue);
		if (status == null) {
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}

		Object messageAttribute = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
		String message = status.is5xxServerError()
				? "An unexpected error occurred"
				: messageAttribute instanceof String value && !value.isBlank()
						? value
						: status.getReasonPhrase();
		ApiErrorResponse body = new ApiErrorResponse(
				status.value(), codeFor(status).name(), message, Map.of());
		return ResponseEntity.status(status).body(body);
	}

	static ApiErrorCode codeFor(HttpStatus status) {
		return switch (status) {
			case BAD_REQUEST -> ApiErrorCode.BAD_REQUEST;
			case UNAUTHORIZED -> ApiErrorCode.UNAUTHORIZED;
			case FORBIDDEN -> ApiErrorCode.FORBIDDEN;
			case NOT_FOUND -> ApiErrorCode.RESOURCE_NOT_FOUND;
			case CONFLICT -> ApiErrorCode.CONFLICT;
			case UNPROCESSABLE_ENTITY -> ApiErrorCode.UNPROCESSABLE_ENTITY;
			default -> status.is5xxServerError() ? ApiErrorCode.INTERNAL_ERROR : ApiErrorCode.BAD_REQUEST;
		};
	}
}