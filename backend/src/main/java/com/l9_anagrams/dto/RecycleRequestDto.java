package com.l9_anagrams.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;

/**
 * Richiesta di POST /api/collection/recycle (Contratto API §4.4):
 * { "items": [ { "cardId": 9, "quantity": 1 } ] } oppure { "all": true }.
 * Qui si controlla solo la forma delle voci; che ci sia esattamente una delle due
 * modalità lo verifica il service (400 VALIDATION_ERROR).
 */
@Schema(description = "Cards to recycle: either a list of items or all = true (every recyclable duplicate)")
public record RecycleRequestDto(
        @Schema(description = "Copies to recycle, per card. Omit when all = true")
        @Valid List<RecycleItemDto> items,

        @Schema(description = "True to recycle every recyclable duplicate. Omit when items is given", example = "false")
        Boolean all) {

    /** True se la richiesta chiede di riciclare tutti i doppioni riciclabili. */
    public boolean recycleAll() {
        return Boolean.TRUE.equals(all);
    }
}
