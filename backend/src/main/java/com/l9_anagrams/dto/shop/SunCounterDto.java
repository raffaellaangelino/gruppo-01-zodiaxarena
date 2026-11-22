package com.l9_anagrams.dto.shop;

import io.swagger.v3.oas.annotations.media.Schema;

/** Stelle aperte senza Leggendaria (done) verso il Sole garantito (total). */
@Schema(description = "Stars opened without a Legendary, towards the guaranteed Sun")
public record SunCounterDto(
		@Schema(description = "Stars opened since the last Legendary", example = "6") int done,
		@Schema(description = "Stars within which a Legendary (Sun) is guaranteed", example = "10") int total) {
}
