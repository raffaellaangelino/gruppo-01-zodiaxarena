package com.l9_anagrams.dto;

import java.util.List;

/** Esito della validazione di un mazzo: violations contiene i codici delle regole violate. */
public record DeckValidationDto(boolean valid, List<String> violations) {

}
