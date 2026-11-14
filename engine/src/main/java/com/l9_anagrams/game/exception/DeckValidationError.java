package com.l9_anagrams.game.exception;

public record DeckValidationError(DeckOwner player, String message) {
}