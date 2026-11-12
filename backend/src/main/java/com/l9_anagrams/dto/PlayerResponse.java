package com.l9_anagrams.dto;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.l9_anagrams.entity.Player;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerResponse {

    private Long id;
    private Long appUserId;
    private String nickName;
    private long credits;
    private String house;
    private LocalDateTime lastHouseChange;
    private int pityCounter;
    private Long sunSignId;
    private LocalDate birthDate;
    private List<Long> playerCardIds;
    private Long deckId;

    // restituisce DTO a partire da entity corrispondente
    public static PlayerResponse from(Player player) {

        PlayerResponse dto = new PlayerResponse();

        dto.setId(player.getId());

        if (player.getAppUser() != null) {
            dto.setAppUserId(player.getAppUser().getId());
        }

        dto.setNickName(player.getNickName());
        dto.setCredits(player.getCredits());
        dto.setHouse(player.getHouse());
        dto.setLastHouseChange(player.getLastHouseChange());
        dto.setPityCounter(player.getPityCounter());
        dto.setBirthDate(player.getBirthDate());

        if (player.getSunSign() != null) {
            dto.setSunSignId(player.getSunSign().getId());
        }

        dto.setPlayerCardIds(
                player.getPlayerCards()
                        .stream()
                        .map(pc -> pc.getId())
                        .collect(Collectors.toList()));

        if (player.getDeck() != null) {
            dto.setDeckId(player.getDeck().getId());
        }

        return dto;
    }
}
