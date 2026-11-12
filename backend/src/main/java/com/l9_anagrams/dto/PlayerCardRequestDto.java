package com.l9_anagrams.dto;

import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.PlayerCard;

public record PlayerCardRequestDto(
        Long playerId,
        CardDefinition cardDefinition) {

    public static PlayerCardRequestDto from(PlayerCard playerCard) {
        return new PlayerCardRequestDto(
                playerCard.getPlayer() != null ? playerCard.getPlayer().getId() : null,
                playerCard.getCardDefinition());
    }
}