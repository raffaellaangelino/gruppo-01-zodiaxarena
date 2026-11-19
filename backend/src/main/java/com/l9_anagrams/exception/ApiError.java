package com.l9_anagrams.exception;

import java.util.List;

/**
 * Formato errori del contratto (§1.2). Per ora serve a Swagger per documentare
 * gli errori; a riempirlo sarà il @RestControllerAdvice (step 3).
 */
public record ApiError(int status, String code, String message, List<FieldErrorItem> fieldErrors) {

    public record FieldErrorItem(String field, String message) {
    }
}
