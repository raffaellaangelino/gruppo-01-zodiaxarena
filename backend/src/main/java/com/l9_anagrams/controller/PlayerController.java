package com.l9_anagrams.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.dto.PlayerResponseDto;

@RestController
@RequestMapping("api/players")
public class PlayerController {

    @GetMapping("")
    public ResponseEntity<List<PlayerResponseDto>> getAllPlayers() {
        //TODO utenti devono poter chiamare solo i propri dati
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/me")
    public ResponseEntity<PlayerResponseDto> getMe() {
        //TODO utenti devono poter chiamare solo i propri dati
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerResponseDto> getPlayerById(@PathVariable Long id) {
        //TODO utenti devono poter chiamare solo i propri dati
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
