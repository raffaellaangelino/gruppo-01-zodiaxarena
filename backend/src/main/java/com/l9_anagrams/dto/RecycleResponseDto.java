package com.l9_anagrams.dto;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

/** Risposta 200 di POST /api/collection/recycle (Contratto API §4.4). */
@Schema(description = "Result of a recycle: credits gained, new balance and trades no longer valid")
public record RecycleResponseDto(
        @Schema(description = "Credits gained by this recycle", example = "60")
        long creditsGained,

        @Schema(description = "Credits after the recycle", example = "400")
        long balance,

        // TODO scambi (D-023): popolato quando il modulo scambi sarà integrato; per ora sempre vuoto
        @Schema(description = "Ids of open trades that contained a recycled copy and are no longer valid", example = "[12]")
        List<Long> invalidatedTrades) {
}
