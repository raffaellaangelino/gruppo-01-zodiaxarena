package com.l9_anagrams.dto;

import java.util.List;

import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.PlayerCard;

public record DeckRequestDto(
        Long playerId,
        PlayerCard ascendant,
        List<PlayerCard> playerCards) {

    // restituisce DTO a partire da entity corrispondente
    public static DeckRequestDto from(Deck deck) {
        return new DeckRequestDto(deck.getPlayer().getId(), deck.getAscendant(), deck.getPlayerCards());
    }
}
