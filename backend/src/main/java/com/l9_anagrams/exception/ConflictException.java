package com.l9_anagrams.exception;

public class ConflictException extends RuntimeException {
    private final ApiErrorCode code;

    public ConflictException(String message) {
        this(ApiErrorCode.CONFLICT, message);
    }

    public ConflictException(ApiErrorCode code, String message) {
        super(message);
        this.code = code;
    }

    public ApiErrorCode getCode() {
        return code;
    }
}
