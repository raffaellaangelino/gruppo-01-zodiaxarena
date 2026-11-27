package com.l9_anagrams.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** Una voce della richiesta di riciclo (Contratto API §4.4): quante copie di una carta riciclare. */
@Schema(description = "How many copies of a card to recycle")
public record RecycleItemDto(
        @Schema(description = "Card definition id", example = "9")
        @NotNull Long cardId,

        @Schema(description = "Copies to recycle (never the last copy, never a copy in a deck)", example = "1")
        @Min(1) int quantity) {
}
