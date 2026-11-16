package com.l9_anagrams.service;

import java.util.List;

import com.l9_anagrams.dto.PlayerCardResponseDto;

public interface PlayerCardService {

    /** Solo admin: da proteggere nel controller */
    public List<PlayerCardResponseDto> getAll();

    public List<PlayerCardResponseDto> getMine(String email);

    //* Un utente può leggere solo le proprie carte */
    public PlayerCardResponseDto getById(Long id, String email);
}
