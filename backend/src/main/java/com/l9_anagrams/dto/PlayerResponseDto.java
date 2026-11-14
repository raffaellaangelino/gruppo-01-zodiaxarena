package com.l9_anagrams.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.enums.God;

public record PlayerResponseDto(
        Long id,
        Long appUserId,
        String nickName,
        long credits,
        God house,
        LocalDateTime lastHouseChange,
        int pityCounter,
        Sign sunSign,
        LocalDate birthDate,
        List<PlayerCard> playerCards,
        Long deckId) {

    public static PlayerResponseDto from(Player player) {
        return new PlayerResponseDto(
                player.getId(),
                player.getAppUser() != null ? player.getAppUser().getId() : null,
                player.getNickName(),
                player.getCredits(),
                player.getGod(),
                player.getLastGodChange(),
                player.getPityCounter(),
                player.getSunSign(),
                player.getBirthDate(),
                player.getPlayerCards(),
                player.getDeck() != null ? player.getDeck().getId() : null);
    }
}
