package com.l9_anagrams.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.exception.ApiErrorResponse;
import com.l9_anagrams.dto.CardDefinitionResponseDto;
import com.l9_anagrams.service.CardDefinitionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("api/cards")
@Tag(name = "Card definitions", description = "Read-only catalog of creature and Ascendant card definitions")
@SecurityRequirement(name = "bearerAuth")
public class CardDefinitionController {

	private final CardDefinitionService service;

	public CardDefinitionController(CardDefinitionService service) {
		this.service = service;
	}

	// TODO dovrebbe essere pubblico?
	@GetMapping("")
	@Operation(summary = "List card definitions", description = "Returns all creature and Ascendant card definitions in the catalog.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Card definition catalog", content = @Content(array = @ArraySchema(schema = @Schema(implementation = CardDefinitionResponseDto.class)))),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "500", description = "Unexpected server error", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<List<CardDefinitionResponseDto>> getCards() {

		return ResponseEntity.ok(service.getAll());
	}

}
