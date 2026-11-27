package com.l9_anagrams.service;

import java.util.List;

import com.l9_anagrams.dto.CollectionResponseDto;
import com.l9_anagrams.dto.PlayerCardResponseDto;
import com.l9_anagrams.dto.RecycleRequestDto;
import com.l9_anagrams.dto.RecycleResponseDto;

public interface PlayerCardService {

    /** Solo admin: da proteggere nel controller */
    public List<PlayerCardResponseDto> getAll();

    /** Un utente può leggere solo le proprie carte */
    public PlayerCardResponseDto getById(Long id, String email);

    public CollectionResponseDto getCollection(Long appUserId);

    /**
     * Ricicla doppioni in cambio di crediti (Contratto API §4.4).
     * Mai l'ultima copia di una carta, mai una copia in un Cielo: altrimenti 422 CANNOT_RECYCLE_LAST_COPY.
     */
    public RecycleResponseDto recycle(Long appUserId, RecycleRequestDto request);
}
