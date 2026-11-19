package com.l9_anagrams.service;

import com.l9_anagrams.dto.deck.DeckListResponse;
import com.l9_anagrams.dto.deck.DeckResponse;
import com.l9_anagrams.dto.deck.DeckSaveRequest;

public interface DeckService {

    int MAX_DECKS = 3;

    DeckListResponse listDecks(String email);

    DeckResponse getDeck(String email, Long deckId);

    DeckResponse createDeck(String email, DeckSaveRequest request);

    DeckResponse updateDeck(String email, Long deckId, DeckSaveRequest request);

    void deleteDeck(String email, Long deckId);
}
