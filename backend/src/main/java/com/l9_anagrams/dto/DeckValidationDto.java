package com.l9_anagrams.dto;

import java.util.List;

public record DeckValidationDto(boolean valid, List<String> violations) {

}
