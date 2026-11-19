package com.l9_anagrams.dto.deck;

import java.util.Map;

import com.l9_anagrams.entity.DeckSlot;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Richiesta di creazione/salvataggio di un mazzo (contratto §5).
 * Controlla solo la forma: le regole V1-V8 le valuta il service, perché
 * un mazzo incompleto deve poter essere salvato come bozza.
 */
public record DeckSaveRequest(
        @NotBlank @Size(max = 40) String name,
        @NotNull Map<DeckSlot, Long> slots // id CardDefinition per slot; null = slot vuoto
) {
}
