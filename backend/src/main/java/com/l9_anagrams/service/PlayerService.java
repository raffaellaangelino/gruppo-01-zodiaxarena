package com.l9_anagrams.service;

import java.util.List;

import com.l9_anagrams.dto.PlayerRequestDto;
import com.l9_anagrams.dto.PlayerResponseDto;

public interface PlayerService {

    /** Solo admin: da proteggere nel controller */
    public List<PlayerResponseDto> getAll();

    public PlayerResponseDto getMe(String email);

    //** Un utente può leggere solo il proprio giocatore */
    public PlayerResponseDto getById(Long id, String email);

    public PlayerResponseDto create(String email, PlayerRequestDto request);
}
