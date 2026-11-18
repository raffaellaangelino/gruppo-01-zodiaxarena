package com.l9_anagrams.service;

import java.util.List;

import com.l9_anagrams.dto.DeckRequestDto;
import com.l9_anagrams.dto.DeckResponseDto;
import com.l9_anagrams.dto.DeckValidationDto;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Player;

public interface DeckService {

    /** Solo admin: da proteggere nel controller */
    public List<DeckResponseDto> getAll();

    public List<DeckResponseDto> getMine(String email);
    public DeckResponseDto getById(Long id, String email);

    /** Controlla il mazzo senza salvarlo e restituisce le regole violate */
    public DeckValidationDto validate(String email, DeckRequestDto request);

    public DeckValidationDto validateDeck(Player player, Deck deck);

    public DeckResponseDto create(String email, DeckRequestDto request);

    public DeckResponseDto update(Long id, String email, DeckRequestDto request);

    public void delete(Long id, String email);
}
