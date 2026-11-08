package com.l9_anagrams.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.dto.CardDefinitionResponseDto;
import com.l9_anagrams.service.CardDefinitionService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/cards")
public class CardDefinitionController {

	private CardDefinitionService service;

	public CardDefinitionController(CardDefinitionService service) {
		this.service = service;
	}

	// TODO dovrebbe essere pubblico?
	@GetMapping("")
	public ResponseEntity<List<CardDefinitionResponseDto>> getCards() {

		return ResponseEntity.ok(service.getAll());
	}

}
