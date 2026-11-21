package com.l9_anagrams.exception;

import java.util.List;

public class RuleViolationException extends RuntimeException{
    private final ApiErrorCode code;
    private final List<String> violations;

    public RuleViolationException(List<String> violations) {
        this(ApiErrorCode.RULE_VIOLATION, violations);
    }

    /** Con un codice specifico per il frontend (es. CARD_NOT_OWNED, DECK_INVALID). */
    public RuleViolationException(ApiErrorCode code, List<String> violations) {
        super(String.join("; ", violations));
        this.code = code;
        this.violations = violations;
    }

    public ApiErrorCode getCode() {
        return code;
    }

    public List<String> getViolations() {
        return violations;
    }

}
