package com.l9_anagrams.exception;

import java.util.List;

public class RuleViolationException extends RuntimeException{
    private final List<String> violations;

    public RuleViolationException(List<String> violations) {
        super(String.join("; ", violations));
        this.violations = violations;
    }

    public List<String> getViolations() {
        return violations;
    }

    

}
