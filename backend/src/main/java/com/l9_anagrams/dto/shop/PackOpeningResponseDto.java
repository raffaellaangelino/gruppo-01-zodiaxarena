package com.l9_anagrams.dto.shop;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.l9_anagrams.enums.PackSlotType;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Risposta dell'acquisto (201) e del riepilogo GET /api/shop/openings/{openingId}: stessa forma.
 * recycleValue è sempre 0 finché il riciclo non è implementato.
 */
@Schema(description = "A pack opening: the drawn cards and the player's state after the purchase")
public record PackOpeningResponseDto(
		@Schema(description = "Opening id, used to recover the summary", example = "501") Long openingId,
		@Schema(description = "Drawn cards in slot order") List<OpenedCardDto> cards,
		@Schema(description = "Credits left after the purchase", example = "240") long balance,
		SunCounterDto sunCounter,
		@Schema(description = "True if the Star gave a Legendary (the counter restarts from 0)", example = "true") boolean sunFound) {

	@Schema(description = "A card drawn from the pack")
	public record OpenedCardDto(
			@Schema(description = "Slot number, starting from 1", example = "1") int slot,
			@Schema(description = "Slot type (STAR = rarity drawn with the pack's starOdds)", example = "COMMON") PackSlotType slotType,
			@Schema(description = "Card definition id", example = "74") Long cardId,
			// Esplicito: senza, Jackson potrebbe esporlo come "new" togliendo il prefisso "is"
			@Schema(description = "False if the player already owned it, or it already came out in this pack", example = "false")
			@JsonProperty("isNew") boolean isNew,
			@Schema(description = "Credits obtained by recycling the card. Always 0: recycling is not implemented yet", example = "0")
			int recycleValue) {
	}
}
