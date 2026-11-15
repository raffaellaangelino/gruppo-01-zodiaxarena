package com.l9_anagrams.dto;

import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.PlayerCard;

public record PlayerCardResponseDto(
        Long id,
        Long playerId,
        CardDefinition cardDefinition) {

    public static PlayerCardResponseDto from(PlayerCard playerCard) {
        return new PlayerCardResponseDto(
                playerCard.getId(),
                playerCard.getPlayer() != null ? playerCard.getPlayer().getId() : null,
                playerCard.getCardDefinition());
    }
}