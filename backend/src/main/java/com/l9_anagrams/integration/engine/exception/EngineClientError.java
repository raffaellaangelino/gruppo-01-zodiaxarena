package com.l9_anagrams.integration.engine.exception;

import com.fasterxml.jackson.annotation.JsonInclude;

public record EngineClientError(
		@JsonInclude(JsonInclude.Include.NON_NULL) String player,
		String message) {
}