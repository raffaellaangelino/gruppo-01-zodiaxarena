package com.l9_anagrams.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.userdetails.AppUserPrincipal;
import com.l9_anagrams.dto.deck.DeckListResponse;
import com.l9_anagrams.dto.deck.DeckResponse;
import com.l9_anagrams.dto.deck.DeckSaveRequest;
import com.l9_anagrams.exception.ApiError;
import com.l9_anagrams.service.DeckService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * I mazzi del giocatore autenticato. L'utente arriva sempre dal token, mai dalla
 * richiesta; il controllo di proprietà del mazzo lo fa il service (404 se non è suo).
 * Nessun try/catch: gli errori li gestisce il @RestControllerAdvice.
 */
@RestController
@RequestMapping("/api/decks")
@RequiredArgsConstructor
@Tag(name = "Decks", description = "I mazzi (Cieli) del giocatore autenticato, massimo 3")
@SecurityRequirement(name = "bearerAuth")
public class DeckController {

    private final DeckService deckService;

    @GetMapping
    @Operation(summary = "Elenco dei miei mazzi")
    public DeckListResponse listMyDecks(@AuthenticationPrincipal AppUserPrincipal principal) {
        return deckService.listDecks(principal.getUsername());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crea un mazzo, anche come bozza non valida")
    @ApiResponse(responseCode = "201", description = "Creato; valid=false se viola V1–V8")
    @ApiResponse(responseCode = "409", description = "DECK_LIMIT_REACHED",
            content = @Content(schema = @Schema(implementation = ApiError.class)))
    @ApiResponse(responseCode = "422", description = "CARD_NOT_OWNED",
            content = @Content(schema = @Schema(implementation = ApiError.class)))
    public DeckResponse createDeck(@AuthenticationPrincipal AppUserPrincipal principal,
                                   @Valid @RequestBody DeckSaveRequest request) {
        return deckService.createDeck(principal.getUsername(), request);
    }

    @GetMapping("/{deckId}")
    @Operation(summary = "Un mio mazzo, con validità, problemi e statistiche")
    @ApiResponse(responseCode = "404", description = "Inesistente o di un altro giocatore",
            content = @Content(schema = @Schema(implementation = ApiError.class)))
    public DeckResponse getDeck(@AuthenticationPrincipal AppUserPrincipal principal,
                                @PathVariable Long deckId) {
        return deckService.getDeck(principal.getUsername(), deckId);
    }

    @PutMapping("/{deckId}")
    @Operation(summary = "Salva un mio mazzo, anche come bozza non valida")
    @ApiResponse(responseCode = "422", description = "CARD_NOT_OWNED",
            content = @Content(schema = @Schema(implementation = ApiError.class)))
    public DeckResponse updateDeck(@AuthenticationPrincipal AppUserPrincipal principal,
                                   @PathVariable Long deckId,
                                   @Valid @RequestBody DeckSaveRequest request) {
        return deckService.updateDeck(principal.getUsername(), deckId, request);
    }

    @DeleteMapping("/{deckId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cancella un mio mazzo (non l'ultimo)")
    @ApiResponse(responseCode = "409", description = "LAST_DECK",
            content = @Content(schema = @Schema(implementation = ApiError.class)))
    public void deleteDeck(@AuthenticationPrincipal AppUserPrincipal principal,
                           @PathVariable Long deckId) {
        deckService.deleteDeck(principal.getUsername(), deckId);
    }
}
