package com.l9_anagrams.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.CollectionResponseDto;
import com.l9_anagrams.dto.RecycleRequestDto;
import com.l9_anagrams.dto.RecycleResponseDto;
import com.l9_anagrams.exception.ApiErrorResponse;
import com.l9_anagrams.service.PlayerCardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/collection")
@Tag(name = "Collection", description = "Authenticated player's aggregated card collection")
@SecurityRequirement(name = "bearerAuth")
public class CollectionController {

    private final PlayerCardService playerCardService;

    public CollectionController(PlayerCardService playerCardService) {
        this.playerCardService = playerCardService;
    }

    @GetMapping("")
    @Operation(
            summary = "Get my collection",
            description = "Returns the authenticated player's aggregated collection, progress, and duplicates: "
                    + "duplicates counts only the copies that can be recycled right now (never the last copy, "
                    + "never a copy in a deck) and their total recycle value.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Authenticated player's collection",
                    content = @Content(schema = @Schema(implementation = CollectionResponseDto.class))),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(
                    responseCode = "404",
                    description = "Player profile not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(
                    responseCode = "500",
                    description = "Unexpected server error",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<CollectionResponseDto> getCollection(
            @AuthenticationPrincipal AppUserPrincipal user) {
        //TODO utenti devono poter chiamare solo i propri dati
        return ResponseEntity.ok(playerCardService.getCollection(user.userId()));
    }

    @PostMapping("/recycle")
    @Operation(
            summary = "Recycle duplicates",
            description = "Recycles copies for credits (Common 5, Rare 10, Epic 25, Legendary 60, Ascendant 100). "
                    + "Send either items or all = true. Never the last copy of a card, never a copy in a deck: "
                    + "otherwise nothing is recycled (422). Open trades containing a recycled copy become "
                    + "no longer valid and are listed in invalidatedTrades.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Copies recycled, credits added",
                    content = @Content(schema = @Schema(implementation = RecycleResponseDto.class))),
            @ApiResponse(
                    responseCode = "400",
                    description = "Malformed request: neither or both of items and all, or invalid items",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(
                    responseCode = "401",
                    description = "Authentication required",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(
                    responseCode = "404",
                    description = "Player profile not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(
                    responseCode = "422",
                    description = "CANNOT_RECYCLE_LAST_COPY: more copies requested than recyclable",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(
                    responseCode = "500",
                    description = "Unexpected server error",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<RecycleResponseDto> recycle(
            @AuthenticationPrincipal AppUserPrincipal user,
            @Valid @RequestBody RecycleRequestDto request) {
        return ResponseEntity.ok(playerCardService.recycle(user.userId(), request));
    }
}
