package com.l9_anagrams.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.MatchResponseDto;
import com.l9_anagrams.exception.ApiErrorResponse;
import com.l9_anagrams.service.MatchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/matches")
@Tag(name = "Matches", description = "Played matches: replay (Rotolo) and seen state")
@SecurityRequirement(name = "bearerAuth")
public class MatchController {
	private final MatchService matchService;

	public MatchController(MatchService matchService) {
		this.matchService = matchService;
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get a played match", description = "Return the engine result as stored, the two players and the viewer's side (A = challenger, B = challenged).")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Match", content = @Content(schema = @Schema(implementation = MatchResponseDto.class))),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "404", description = "Match not found, not ready, or not yours", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<MatchResponseDto> get(
			@PathVariable("id") Long id,
			@AuthenticationPrincipal AppUserPrincipal user) {
		return ResponseEntity.ok(matchService.get(user.email(), id));
	}

	@PostMapping("/{id}/seen")
	@Operation(summary = "Mark a match as seen", description = "Called when the player opens the replay: removes it from TO_PLAY. Idempotent.")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "Marked as seen"),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "404", description = "Match not found, not ready, or not yours", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<Void> seen(
			@PathVariable("id") Long id,
			@AuthenticationPrincipal AppUserPrincipal user) {
		matchService.markSeen(user.email(), id);
		return ResponseEntity.noContent().build();
	}
}
