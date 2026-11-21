package com.l9_anagrams.service;

import com.l9_anagrams.dto.DeckValidationDto;
import com.l9_anagrams.dto.deck.DeckListResponse;
import com.l9_anagrams.dto.deck.DeckResponse;
import com.l9_anagrams.dto.deck.DeckSaveRequest;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Player;

public interface DeckService {

    int MAX_DECKS = 3;

    DeckListResponse listDecks(String email);

    DeckResponse getDeck(String email, Long deckId);

    DeckResponse createDeck(String email, DeckSaveRequest request);

    DeckResponse updateDeck(String email, Long deckId, DeckSaveRequest request);

    void deleteDeck(String email, Long deckId);

    /** Regole V1-V8 su un mazzo già salvato; la usano le sfide (ChallengeDeckService). */
    DeckValidationDto validateDeck(Player player, Deck deck);
}
