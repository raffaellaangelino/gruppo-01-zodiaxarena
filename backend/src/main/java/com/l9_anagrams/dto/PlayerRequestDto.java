package com.l9_anagrams.dto;

import java.time.LocalDate;

import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.Sign;

public record PlayerRequestDto(
        Long appUserId,
        String nickName,
        long credits,
        String house,
        int pityCounter,
        Sign sunSign,
        LocalDate birthDate) {

    public static PlayerRequestDto from(Player player) {
        return new PlayerRequestDto(
                player.getAppUser() != null ? player.getAppUser().getId() : null,
                player.getNickName(),
                player.getCredits(),
                player.getHouse(),
                player.getPityCounter(),
                player.getSunSign(),
                player.getBirthDate());
    }
}