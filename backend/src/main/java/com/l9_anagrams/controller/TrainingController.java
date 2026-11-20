package com.l9_anagrams.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.TrainingMatchResponseDto;
import com.l9_anagrams.dto.TrainingRequestDto;
import com.l9_anagrams.service.TrainingService;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.validation.Valid;

// TODO: Re-enable this controller in OpenAPI and expose the training endpoint
// when training is added to the finished-product API.
@Hidden
@RestController
@RequestMapping("/api/training")
public class TrainingController {
	private final TrainingService trainingService;

	public TrainingController(TrainingService trainingService) {
		this.trainingService = trainingService;
	}

	@PostMapping
	public ResponseEntity<TrainingMatchResponseDto> play(
			@Valid @RequestBody TrainingRequestDto request,
			@AuthenticationPrincipal AppUserPrincipal user) {
		return ResponseEntity.ok(trainingService.play(user.email(), request.deckId()));
	}
}
