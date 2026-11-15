package com.l9_anagrams.dto;

import java.util.List;

import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.PlayerCard;

public record DeckResponseDto(
        Long id,
        Long playerId,
        PlayerCard ascendant,
        List<PlayerCard> playerCards) {

    public static DeckResponseDto from(Deck deck) {
        return new DeckResponseDto(
                deck.getId(),
                deck.getPlayer() != null ? deck.getPlayer().getId() : null,
                deck.getAscendant(),
                deck.getPlayerCards());
    }
}
