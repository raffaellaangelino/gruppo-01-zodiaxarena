package com.l9_anagrams.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.FactionChoiceRequestDto;
import com.l9_anagrams.dto.PlayerResponseDto;
import com.l9_anagrams.dto.PlayerSearchResponseDto;
import com.l9_anagrams.service.PlayerSearchService;
import com.l9_anagrams.service.PlayerService;
import com.l9_anagrams.exception.ApiErrorResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("api/players")
@Tag(name = "Players", description = "Player profile and first faction selection")
@SecurityRequirement(name = "bearerAuth")
public class PlayerController {
    private final PlayerService playerService;
    private final PlayerSearchService playerSearchService;

    public PlayerController(PlayerService playerService, PlayerSearchService playerSearchService) {
        this.playerService = playerService;
        this.playerSearchService = playerSearchService;
    }

    @GetMapping("")
    @Operation(hidden = true)
    public ResponseEntity<List<PlayerResponseDto>> getAllPlayers() {
        // TODO utenti devono poter chiamare solo i propri dati
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @GetMapping("/me")
    @Operation(summary = "Get my player profile", description = "Return the authenticated player's profile and onboarding state.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Player profile", content = @Content(schema = @Schema(implementation = PlayerResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Player profile not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<PlayerResponseDto> getMe(@AuthenticationPrincipal AppUserPrincipal user) {
        return ResponseEntity.ok(playerService.getMe(user.email()));
    }

    @PutMapping("/me/faction")
    @Operation(summary = "Choose initial faction", description = "Set the player's first faction and complete faction onboarding.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Faction selected", content = @Content(schema = @Schema(implementation = PlayerResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid faction value", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Initial faction already selected", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<PlayerResponseDto> chooseInitialFaction(
            @AuthenticationPrincipal AppUserPrincipal user,
            @Valid @RequestBody FactionChoiceRequestDto request) {
        return ResponseEntity.ok(playerService.chooseInitialFaction(user.email(), request.god()));
    }

    // Percorso letterale: ha la precedenza su /{id}
    @GetMapping("/search")
    @Operation(summary = "Search players", description = "Players whose nickname contains q (case-insensitive, from the 3rd character, max 20), excluding the caller. pendingChallengeId is set when a challenge between the two is already pending.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Matching players", content = @Content(schema = @Schema(implementation = PlayerSearchResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<PlayerSearchResponseDto> search(
            @AuthenticationPrincipal AppUserPrincipal user,
            @RequestParam(name = "q", required = false) String q) {
        return ResponseEntity.ok(playerSearchService.search(user.email(), q));
    }

    @GetMapping("/{id}")
    @Operation(hidden = true)
    public ResponseEntity<PlayerResponseDto> getPlayerById(@PathVariable Long id) {
        // TODO solo admin
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
