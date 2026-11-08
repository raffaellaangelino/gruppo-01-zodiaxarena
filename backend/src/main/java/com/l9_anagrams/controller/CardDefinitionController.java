package com.l9_anagrams.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("api/cards")
public class CardDefinitionController {

	@GetMapping("")
	public ResponseEntity<List<Object>> getCards() {
		return ResponseEntity.ok(null);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Object> getCardById(@PathVariable Long id) {
		return ResponseEntity.ok(null);
	}

}
