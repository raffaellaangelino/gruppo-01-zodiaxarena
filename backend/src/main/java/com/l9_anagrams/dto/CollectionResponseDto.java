package com.l9_anagrams.dto;

import java.util.List;

public record CollectionResponseDto(
        CollectionProgressDto progress,
        CollectionDuplicatesDto duplicates,
        List<CollectionCardDto> cards) {
}
