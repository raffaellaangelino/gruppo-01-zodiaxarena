package com.l9_anagrams.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.PlayerCardResponseDto;

@RestController
@RequestMapping("api/player-cards")
public class PlayerCardController {

    @GetMapping("")
    public ResponseEntity<List<PlayerCardResponseDto>> getAllPlayerCards() {
        // TODO utenti devono poter chiamare solo i propri dati
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/me")
    public ResponseEntity<List<PlayerCardResponseDto>> getMyPlayerCards(
            @AuthenticationPrincipal AppUserPrincipal user) {
        // TODO utenti devono poter chiamare solo i propri dati
        // user.userId() contiene l'id dell user che è uguale all'id del player
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerCardResponseDto> getPlayerCardById(@PathVariable Long id) {
        // TODO solo admin
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
