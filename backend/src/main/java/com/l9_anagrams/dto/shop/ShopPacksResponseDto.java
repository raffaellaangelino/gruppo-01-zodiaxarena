package com.l9_anagrams.dto.shop;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.PackGuarantee;
import com.l9_anagrams.enums.PackPurchaseLimit;
import com.l9_anagrams.enums.PackSlotType;
import com.l9_anagrams.enums.PackUnavailableReason;

import io.swagger.v3.oas.annotations.media.Schema;

/** GET /api/shop/packs: saldo, contatore del Sole e pacchetti in vendita. */
@Schema(description = "Shop: the player's credits, Sun counter and the packs on sale")
public record ShopPacksResponseDto(
		@Schema(description = "Player's credits", example = "340") long balance,
		SunCounterDto sunCounter,
		@Schema(description = "Packs on sale, in shop order") List<PackDto> packs) {

	@Schema(description = "A pack on sale. Prices and contents come from the database: the frontend must not hardcode them")
	public record PackDto(
			@Schema(description = "Pack code, used in the purchase URL", example = "COSTELLAZIONE") String code,
			@Schema(description = "Display name", example = "Costellazione") String name,
			@Schema(description = "Short description of the pack's role", example = "Il pacchetto di tutti i giorni") String role,
			@Schema(description = "Price in credits", example = "100") int price,
			@Schema(description = "Number of cards in the pack", example = "5") int cardCount,
			@Schema(description = "Slot types in order", example = "[\"COMMON\",\"COMMON\",\"COMMON\",\"RARE\",\"STAR\"]")
			List<PackSlotType> slots,
			@Schema(description = "Probability of each rarity for the STAR slot (sums to 1)",
					example = "{\"RARE\":0.6,\"EPIC\":0.3,\"LEGENDARY\":0.08,\"ASCENDANT\":0.02}")
			Map<CardRarity, BigDecimal> starOdds,
			@Schema(description = "Guarantees, derived from the slots", example = "[\"SUN_WITHIN_10_STARS\",\"NO_DUPLICATE_EPIC_LEGENDARY\"]")
			List<PackGuarantee> guarantees,
			// Solo per i pacchetti con un limite (Luna Piena)
			@Schema(description = "Purchase limit. Present only if the pack has one", example = "ONCE_PER_LUNAR_CYCLE", nullable = true)
			@JsonInclude(JsonInclude.Include.NON_NULL) PackPurchaseLimit limit,
			@Schema(description = "True if the player can buy it now", example = "true") boolean available,
			@Schema(description = "Why the pack cannot be bought now. Null if available", nullable = true)
			PackUnavailableReason unavailableReason,
			@Schema(description = "When the pack can be bought again (release date, next lunar cycle). Null if not applicable",
					example = "2026-11-28T00:00:00Z", nullable = true)
			Instant availableAgainAt) {
	}
}
