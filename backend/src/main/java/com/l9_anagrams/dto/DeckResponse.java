package com.l9_anagrams.dto;
import java.util.List;
import java.util.stream.Collectors;

import com.l9_anagrams.entity.Deck;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeckResponse {

    private Long id;
    private Long playerId;
    private Long ascendantId;
    private List<Long> playerCardIds;

    // restituisce DTO a partire da entity corrispondente
    public static DeckResponse from(Deck deck) {

        DeckResponse dto = new DeckResponse();

        dto.setId(deck.getId());

        if (deck.getPlayer() != null) {
            dto.setPlayerId(deck.getPlayer().getId());
        }

        if (deck.getAscendant() != null) {
            dto.setAscendantId(deck.getAscendant().getId());
        }

        dto.setPlayerCardIds(
                deck.getPlayerCards()
                        .stream()
                        .map(pc -> pc.getId())
                        .collect(Collectors.toList()));

        return dto;
    }
}
