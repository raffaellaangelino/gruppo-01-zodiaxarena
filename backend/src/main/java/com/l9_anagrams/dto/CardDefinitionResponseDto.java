package com.l9_anagrams.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.CardType;

public record CardDefinitionResponseDto(
		Long id,
		CardType type,
		SignResponseDto sign,
		@JsonInclude(JsonInclude.Include.NON_NULL) PlanetResponseDto planet, // absent for ASCENDANT
		String imgId) {
	public static CardDefinitionResponseDto from(CardDefinition card) {
		return new CardDefinitionResponseDto(
				card.getId(),
				card.getType(),
				SignResponseDto.from(card.getSign()),
				card.getPlanet() == null ? null : PlanetResponseDto.from(card.getPlanet()),
				card.getImgId());
	}
}