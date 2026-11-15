package com.l9_anagrams.service;

import java.util.List;

import com.l9_anagrams.dto.DeckResponseDto;
import com.l9_anagrams.dto.DeckRequestDto;
import com.l9_anagrams.dto.DeckValidationDto;

public interface DeckService {

    /** Solo admin: da proteggere nel controller */
    public List<DeckResponseDto> getAll();

    public List<DeckResponseDto> getMine(String email);
    public DeckResponseDto getById(Long id, String email);

    /** Controlla il mazzo senza salvarlo e restituisce le regole violate */
    public DeckValidationDto validate(String email, DeckRequestDto request);

    public DeckResponseDto create(String email, DeckRequestDto request);

    public DeckResponseDto update(Long id, String email, DeckResponseDto request);

    public void delete(Long id, String email);
}
