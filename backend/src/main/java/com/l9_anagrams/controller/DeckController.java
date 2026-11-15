package com.l9_anagrams.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.DeckResponseDto;

@RestController
@RequestMapping("api/decks")
public class DeckController {

    @GetMapping("")
    public ResponseEntity<List<DeckResponseDto>> getAllDecks() {
        // TODO utenti devono poter chiamare solo i propri dati
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/me")
    public ResponseEntity<List<DeckResponseDto>> getMyDecks(@AuthenticationPrincipal AppUserPrincipal user) {
        // TODO utenti devono poter chiamare solo i propri dati
        // user.userId() contiene l'id dell user che è uguale all'id del player
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeckResponseDto> getDeckById(@PathVariable Long id) {
        // TODO solo admin
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
