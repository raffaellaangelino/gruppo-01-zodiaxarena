package com.l9_anagrams.dto.deck;

import java.time.Instant;
import java.util.List;

/** Elenco leggero dei mazzi del giocatore; max dice al frontend quanti se ne possono avere. */
public record DeckListResponse(List<DeckSummary> items, int max) {

    public record DeckSummary(Long id, String name, boolean valid,
                              int problemCount, Instant updatedAt) {
    }
}
