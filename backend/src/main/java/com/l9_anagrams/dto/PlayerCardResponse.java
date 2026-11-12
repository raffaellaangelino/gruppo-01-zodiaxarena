package com.l9_anagrams.dto;
import com.l9_anagrams.entity.PlayerCard;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerCardResponse {

    private Long id;
    private Long playerId;
    private Long cardDefinitionId;

    // restituisce DTO a partire da entity corrispondente
    public static PlayerCardResponse from(PlayerCard playerCard) {

        PlayerCardResponse dto = new PlayerCardResponse();

        dto.setId(playerCard.getId());

        if (playerCard.getPlayer() != null) {
            dto.setPlayerId(playerCard.getPlayer().getId());
        }

        if (playerCard.getCardDefinition() != null) {
            dto.setCardDefinitionId(playerCard.getCardDefinition().getId());
        }

        return dto;
    }
}