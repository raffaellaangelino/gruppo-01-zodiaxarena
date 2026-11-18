package com.l9_anagrams.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.ChallengeAcceptRequestDto;
import com.l9_anagrams.dto.ChallengeCreateRequestDto;
import com.l9_anagrams.dto.ChallengeCreatedDto;
import com.l9_anagrams.dto.ChallengeListResponseDto;
import com.l9_anagrams.dto.MatchCreatedDto;
import com.l9_anagrams.service.ChallengeService;
import com.l9_anagrams.service.ChallengeSseRegistry;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.l9_anagrams.exception.ApiErrorResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@Tag(name = "Challenges", description = "Challenge creation, acceptance, cancellation, listings, and live notifications")
@SecurityRequirement(name = "bearerAuth")
public class ChallengeController {
	private final ChallengeService challengeService;
	private final ChallengeSseRegistry sseRegistry;

	public ChallengeController(ChallengeService challengeService, ChallengeSseRegistry sseRegistry) {
		this.challengeService = challengeService;
		this.sseRegistry = sseRegistry;
	}

	@GetMapping("/challenges")
	@Operation(summary = "List challenges", description = "List received pending and recent played challenges in TO_PLAY, or sent and recently closed challenges in SENT.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Challenge list", content = @Content(schema = @Schema(implementation = ChallengeListResponseDto.class))),
			@ApiResponse(responseCode = "400", description = "Invalid challenge box", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<ChallengeListResponseDto> list(
			@Parameter(description = "Challenge box", schema = @Schema(allowableValues = { "TO_PLAY", "SENT" })) @RequestParam("box") String box,
			@AuthenticationPrincipal AppUserPrincipal user) {
		return ResponseEntity.ok(challengeService.list(user.email(), box));
	}

	@PostMapping("/challenges")
	@Operation(summary = "Create a challenge", description = "Create a pending challenge and snapshot the authenticated player's selected deck.")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Challenge created", content = @Content(schema = @Schema(implementation = ChallengeCreatedDto.class))),
			@ApiResponse(responseCode = "400", description = "Request validation failed", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "404", description = "Opponent or deck not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "409", description = "A pending challenge already exists or self-challenge was attempted", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "422", description = "The selected deck is invalid", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<ChallengeCreatedDto> create(
			@Valid @RequestBody ChallengeCreateRequestDto request,
			@AuthenticationPrincipal AppUserPrincipal user) {
		ChallengeCreatedDto response = challengeService.create(user.email(), request.opponentId(), request.deckId());
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/challenges/{id}/accept")
	@Operation(summary = "Accept a challenge", description = "Snapshot the challenged player's selected deck, synchronously run the engine, and return the resulting match.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Match ready", content = @Content(schema = @Schema(implementation = MatchCreatedDto.class))),
			@ApiResponse(responseCode = "400", description = "Request validation failed", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "404", description = "Challenge not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "409", description = "Challenge is no longer pending", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "422", description = "The selected deck is invalid", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "502", description = "Engine returned an invalid response", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "503", description = "Game engine unavailable", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<MatchCreatedDto> accept(
			@PathVariable("id") Long id,
			@Valid @RequestBody ChallengeAcceptRequestDto request,
			@AuthenticationPrincipal AppUserPrincipal user) {
		return ResponseEntity.ok(challengeService.accept(user.email(), id, request.deckId()));
	}

	@PostMapping("/challenges/{id}/decline")
	@Operation(summary = "Decline a challenge", description = "Decline a received pending challenge.")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "Challenge declined"),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "404", description = "Challenge not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "409", description = "Challenge is no longer pending", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<Void> decline(
			@PathVariable("id") Long id,
			@AuthenticationPrincipal AppUserPrincipal user) {
		challengeService.decline(user.email(), id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/challenges/{id}/withdraw")
	@Operation(summary = "Withdraw a challenge", description = "Withdraw a sent pending challenge.")
	@ApiResponses({
			@ApiResponse(responseCode = "204", description = "Challenge withdrawn"),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "404", description = "Challenge not found", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "409", description = "Challenge is no longer pending", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<Void> withdraw(
			@PathVariable("id") Long id,
			@AuthenticationPrincipal AppUserPrincipal user) {
		challengeService.withdraw(user.email(), id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping(value = "/challenges/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	@Operation(summary = "Subscribe to challenge events", description = "Open an in-memory Server-Sent Events stream for challenge and match notifications. REST endpoints remain authoritative.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "SSE stream opened"),
			@ApiResponse(responseCode = "401", description = "Authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public SseEmitter events(@AuthenticationPrincipal AppUserPrincipal user) {
		return sseRegistry.subscribe(user.userId());
	}
}
