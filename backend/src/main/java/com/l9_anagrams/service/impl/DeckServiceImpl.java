package com.l9_anagrams.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.DeckValidationDto;
import com.l9_anagrams.dto.deck.DeckListResponse;
import com.l9_anagrams.dto.deck.DeckListResponse.DeckSummary;
import com.l9_anagrams.dto.deck.DeckResponse;
import com.l9_anagrams.dto.deck.DeckResponse.DeckProblem;
import com.l9_anagrams.dto.deck.DeckResponse.EffectiveStats;
import com.l9_anagrams.dto.deck.DeckSaveRequest;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.DeckSlot;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.CardType;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ConflictException;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.exception.RuleViolationException;
import com.l9_anagrams.repo.DeckRepo;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.DeckService;

import lombok.RequiredArgsConstructor;

/**
 * Mazzi del giocatore (contratto §5, fino a 3 mazzi in fase 1).
 *
 * Step 2: giocatore dal token, proprietà del mazzo, limite di 3, possesso delle carte,
 * costruzione della risposta. La validazione V1-V8 (valid, problems) e le statistiche
 * effettive arrivano nello step 3.
 */
@Service
@RequiredArgsConstructor
public class DeckServiceImpl implements DeckService {

	private final DeckRepo deckRepo;
	private final PlayerRepo playerRepo;
	private final PlayerCardRepo playerCardRepo;

	// ------------------------------------------------------------------ lettura

	@Override
	@Transactional(readOnly = true)
	public DeckListResponse listDecks(String email) {
		Player player = currentPlayer(email);
		List<DeckSummary> items = deckRepo.findByPlayerId(player.getId()).stream()
				.sorted(Comparator.comparing(Deck::getUpdatedAt).reversed())
				.map(this::toSummary)
				.toList();
		return new DeckListResponse(items, MAX_DECKS);
	}

	@Override
	@Transactional(readOnly = true)
	public DeckResponse getDeck(String email, Long deckId) {
		Player player = currentPlayer(email);
		return toResponse(ownedDeck(deckId, player));
	}

	// ---------------------------------------------------------------- scrittura

	@Override
	@Transactional
	public DeckResponse createDeck(String email, DeckSaveRequest request) {
		Player player = currentPlayer(email);
		// Blocca la riga del giocatore: due creazioni in parallelo non superano il limite
		lockPlayer(player);
		if (deckRepo.countByPlayerId(player.getId()) >= MAX_DECKS) {
			throw new ConflictException(ApiErrorCode.DECK_LIMIT_REACHED,
					"Puoi avere al massimo " + MAX_DECKS + " mazzi");
		}

		Deck deck = new Deck();
		deck.setPlayer(player);
		apply(deck, request, resolveSlots(player, request.slots()));
		return toResponse(deckRepo.saveAndFlush(deck));
	}

	@Override
	@Transactional
	public DeckResponse updateDeck(String email, Long deckId, DeckSaveRequest request) {
		Player player = currentPlayer(email);
		Deck deck = ownedDeck(deckId, player);
		apply(deck, request, resolveSlots(player, request.slots()));
		// saveAndFlush: version e updatedAt aggiornati prima di costruire la risposta
		return toResponse(deckRepo.saveAndFlush(deck));
	}

	@Override
	@Transactional
	public void deleteDeck(String email, Long deckId) {
		Player player = currentPlayer(email);
		lockPlayer(player);
		Deck deck = ownedDeck(deckId, player);
		if (deckRepo.countByPlayerId(player.getId()) <= 1) {
			throw new ConflictException(ApiErrorCode.LAST_DECK, "Non puoi cancellare il tuo unico mazzo");
		}
		// TODO: quando esisteranno le sfide, impedire la cancellazione di un mazzo
		// usato in una sfida in attesa
		deckRepo.delete(deck);
	}

	// ------------------------------------------------------------- validazione

	/**
	 * Usata dalle sfide (ChallengeDeckService) prima di inviare il mazzo all'engine.
	 * Stesse regole della risposta del mazzo: violations contiene i codici dei problemi.
	 */
	@Override
	@Transactional(readOnly = true)
	public DeckValidationDto validateDeck(Player player, Deck deck) {
		List<String> violations = problemsOf(deck).stream()
				.map(problem -> problem.rule() + ": " + problem.code()
						+ (problem.element() == null ? "" : " " + problem.element()))
				.toList();
		return new DeckValidationDto(violations.isEmpty(), violations);
	}

	// ------------------------------------------------------- giocatore e mazzo

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}

	private void lockPlayer(Player player) {
		playerRepo.findByForUpdate(player.getId());
	}

	/** Mazzo inesistente o di un altro giocatore: in entrambi i casi 404 (contratto §1). */
	private Deck ownedDeck(Long deckId, Player player) {
		return deckRepo.findByIdAndPlayerId(deckId, player.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Mazzo non trovato"));
	}

	// ----------------------------------------------------- dagli slot alle carte

	/** Carte scelte dalla richiesta, già tradotte in copie possedute. */
	private record ResolvedSlots(PlayerCard ascendant, Set<PlayerCard> cards) {
	}

	/**
	 * Traduce gli id del catalogo (CardDefinition) in copie possedute (PlayerCard).
	 *
	 * Il mazzo non salva gli slot: è un Ascendente più un insieme di carte. La chiave in cui
	 * arriva una carta conta solo per l'Ascendente: se nello slot ASCENDANT c'è davvero un
	 * Ascendente, va nel campo ascendant; ogni altra carta va nell'insieme delle carte.
	 * Una carta "fuori posto" quindi non è un errore: si salva, e le regole dello step 3
	 * lo segnalano come problema (ad esempio V4: 2 Lune e 0 Soli; V2: manca l'Ascendente;
	 * V7: un Ascendente tra le carte di gioco). Il mazzo resta una bozza (§5.2).
	 *
	 * L'unico errore è CARD_NOT_OWNED (V6, §5.2): una carta che il giocatore non possiede,
	 * o la stessa carta indicata più volte delle copie possedute.
	 */
	private ResolvedSlots resolveSlots(Player player, Map<DeckSlot, Long> slots) {
		// Copie possedute per carta del catalogo, dalla più vecchia (id più basso)
		Map<Long, List<PlayerCard>> ownedByDefinition = playerCardRepo.findByPlayerId(player.getId()).stream()
				.sorted(Comparator.comparing(PlayerCard::getId))
				.collect(Collectors.groupingBy(pc -> pc.getCardDefinition().getId()));
		// Quante copie di ogni carta sono già state usate in questa richiesta
		Map<Long, Integer> used = new HashMap<>();

		List<String> notOwned = new ArrayList<>();
		PlayerCard ascendant = null;
		Set<PlayerCard> cards = new HashSet<>();

		for (Map.Entry<DeckSlot, Long> entry : slots.entrySet()) {
			DeckSlot slot = entry.getKey();
			Long definitionId = entry.getValue();
			if (slot == null || definitionId == null) {
				continue; // slot vuoto: ammesso, il mazzo resta una bozza
			}

			List<PlayerCard> copies = ownedByDefinition.getOrDefault(definitionId, List.of());
			int index = used.merge(definitionId, 1, Integer::sum) - 1;
			if (index >= copies.size()) {
				notOwned.add("slot " + slot + ", carta " + definitionId);
				continue;
			}

			PlayerCard copy = copies.get(index);
			if (slot == DeckSlot.ASCENDANT && copy.getCardDefinition().getType() == CardType.ASCENDANT) {
				ascendant = copy;
			} else {
				cards.add(copy);
			}
		}

		if (!notOwned.isEmpty()) {
			throw new RuleViolationException(ApiErrorCode.CARD_NOT_OWNED, notOwned);
		}
		return new ResolvedSlots(ascendant, cards);
	}

	/** Creatura con pianeta: l'unico tipo di carta che ha uno slot. */
	private boolean isCreature(CardDefinition card) {
		return card.getType() == CardType.CREATURE && card.getPlanet() != null;
	}

	/** Slot di una creatura: il nome del pianeta in maiuscolo ("Sole" -> SOLE). */
	private DeckSlot slotOf(CardDefinition card) {
		return DeckSlot.valueOf(card.getPlanet().getName().toUpperCase(Locale.ROOT));
	}

	private void apply(Deck deck, DeckSaveRequest request, ResolvedSlots resolved) {
		deck.setName(request.name().trim());
		deck.setAscendant(resolved.ascendant());
		deck.getPlayerCards().clear();
		deck.getPlayerCards().addAll(resolved.cards());
		// Impostato anche qui: rende il mazzo "sporco" anche quando cambiano solo le carte,
		// così Hibernate aumenta version e scrive l'UPDATE
		deck.setUpdatedAt(Instant.now());
	}

	// ------------------------------------------------------------ risposte

	private DeckResponse toResponse(Deck deck) {
		List<DeckProblem> problems = problemsOf(deck);
		return new DeckResponse(
				deck.getId(),
				deck.getName(),
				deck.getUpdatedAt(),
				slotsOf(deck),
				problems.isEmpty(),
				problems,
				elementBalanceOf(deck),
				effectiveStatsOf(deck));
	}

	private DeckSummary toSummary(Deck deck) {
		List<DeckProblem> problems = problemsOf(deck);
		return new DeckSummary(deck.getId(), deck.getName(), problems.isEmpty(),
				problems.size(), deck.getUpdatedAt());
	}

	/**
	 * Sempre 8 chiavi, nell'ordine del regolamento; null = slot vuoto.
	 * Ogni creatura va nello slot del suo pianeta. Lo slot ha posto per una sola carta:
	 * se ci sono più creature dello stesso pianeta, o carte che non sono creature, quelle
	 * in più non compaiono qui. Restano salvate e le segnalano i problemi (V4, V7).
	 */
	private Map<DeckSlot, Long> slotsOf(Deck deck) {
		Map<DeckSlot, Long> slots = new EnumMap<>(DeckSlot.class);
		for (DeckSlot slot : DeckSlot.values()) {
			slots.put(slot, null);
		}
		if (deck.getAscendant() != null) {
			slots.put(DeckSlot.ASCENDANT, deck.getAscendant().getCardDefinition().getId());
		}
		deck.getPlayerCards().stream()
				.map(PlayerCard::getCardDefinition)
				.filter(this::isCreature)
				.sorted(Comparator.comparing(CardDefinition::getId)) // risposta sempre uguale
				.forEach(card -> slots.putIfAbsent(slotOf(card), card.getId()));
		return slots;
	}

	/** Numero di creature per elemento; l'Ascendente e le carte non creatura non contano (V8). */
	private Map<SignType, Integer> elementBalanceOf(Deck deck) {
		Map<SignType, Integer> balance = new EnumMap<>(SignType.class);
		for (SignType type : SignType.values()) {
			balance.put(type, 0);
		}
		for (PlayerCard card : deck.getPlayerCards()) {
			if (isCreature(card.getCardDefinition())) {
				balance.merge(card.getCardDefinition().getSign().getType(), 1, Integer::sum);
			}
		}
		return balance;
	}

	/** TODO step 3: regole V1-V8. Finché è vuoto, ogni mazzo risulta valid: true. */
	private List<DeckProblem> problemsOf(Deck deck) {
		return List.of();
	}

	/** TODO step 3: statistiche effettive per carta (SIGN_BASE, PLANET, ...). */
	private Map<Long, EffectiveStats> effectiveStatsOf(Deck deck) {
		return Map.of();
	}
}
