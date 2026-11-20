package com.l9_anagrams.dto;

public record CollectionProgressDto(
        CollectionProgressGroupDto creatures,
        CollectionProgressGroupDto ascendants) {
}
