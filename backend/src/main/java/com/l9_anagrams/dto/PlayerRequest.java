package com.l9_anagrams.dto;

import java.time.LocalDate;

import com.l9_anagrams.entity.Player;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerRequest {

    private Long appUserId;
    private String nickName;
    private long credits;
    private String house;
    private int pityCounter;
    private Long sunSignId;
    private LocalDate birthDate;

    // restituisce DTO a partire da entity corrispondente
    public static PlayerRequest from(Player player) {

        PlayerRequest dto = new PlayerRequest();

        dto.setNickName(player.getNickName());
        dto.setCredits(player.getCredits());
        dto.setHouse(player.getHouse());
        dto.setPityCounter(player.getPityCounter());
        dto.setBirthDate(player.getBirthDate());

        if (player.getAppUser() != null) {
            dto.setAppUserId(player.getAppUser().getId());
        }

        if (player.getSunSign() != null) {
            dto.setSunSignId(player.getSunSign().getId());
        }

        return dto;
    }
}