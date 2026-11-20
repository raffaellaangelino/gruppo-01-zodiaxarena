package com.l9_anagrams.dto;

import java.time.LocalDateTime;

public record CollectionCardDto(
        Long cardId,
        int quantity,
        int tradableCopies,
        boolean inDeck,
        boolean inOpenTrade,
        boolean isNew,
        boolean starter,
        LocalDateTime obtainedAt) {
}
