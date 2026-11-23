package com.l9_anagrams.dto;

import java.util.List;

import com.l9_anagrams.entity.Deck;

public record DeckResponseDto(
		Long id,
		String name,
		Long playerId,
		PlayerCardResponseDto ascendant,
		List<PlayerCardResponseDto> playerCards) {

	public static DeckResponseDto from(Deck deck) {
		return new DeckResponseDto(
				deck.getId(),
				deck.getName(),
				deck.getPlayer() != null ? deck.getPlayer().getId() : null,
				deck.getAscendant() != null ? PlayerCardResponseDto.from(deck.getAscendant()) : null,
				deck.getPlayerCards().stream().map(PlayerCardResponseDto::from).toList());
	}
}