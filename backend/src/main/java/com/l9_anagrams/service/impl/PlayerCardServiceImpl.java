package com.l9_anagrams.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.CollectionCardDto;
import com.l9_anagrams.dto.CollectionDuplicatesDto;
import com.l9_anagrams.dto.CollectionProgressDto;
import com.l9_anagrams.dto.CollectionProgressGroupDto;
import com.l9_anagrams.dto.CollectionResponseDto;
import com.l9_anagrams.dto.PlayerCardResponseDto;
import com.l9_anagrams.dto.RecycleItemDto;
import com.l9_anagrams.dto.RecycleRequestDto;
import com.l9_anagrams.dto.RecycleResponseDto;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.CardType;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ApiException;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.repo.CardDefinitionRepo;
import com.l9_anagrams.repo.DeckRepo;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.PlayerCardService;

@Service
public class PlayerCardServiceImpl implements PlayerCardService {

	private final PlayerCardRepo playerCardRepo;
	private final PlayerRepo playerRepo;
	private final CardDefinitionRepo cardDefinitionRepo;
	private final DeckRepo deckRepo;

	public PlayerCardServiceImpl(
			PlayerCardRepo playerCardRepo,
			PlayerRepo playerRepo,
			CardDefinitionRepo cardDefinitionRepo,
			DeckRepo deckRepo) {
		this.playerCardRepo = playerCardRepo;
		this.playerRepo = playerRepo;
		this.cardDefinitionRepo = cardDefinitionRepo;
		this.deckRepo = deckRepo;
	}

	@Override
	@Transactional(readOnly = true)
	public List<PlayerCardResponseDto> getAll() {
		return playerCardRepo.findAll().stream().map(PlayerCardResponseDto::from).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public PlayerCardResponseDto getById(Long id, String email) {
		Player player = currentPlayer(email);
		return playerCardRepo.findByIdAndPlayerId(id, player.getId())
				.map(PlayerCardResponseDto::from)
				.orElseThrow(() -> new ResourceNotFoundException("Carta non trovata"));
	}

	@Override
	@Transactional(readOnly = true)
	public CollectionResponseDto getCollection(Long appUserId) {
		Player player = playerRepo.findByAppUserId(appUserId)
				.orElseThrow(PlayerCardServiceImpl::playerNotFound);

		Map<Long, OwnedCopies> ownedByCard = ownedCopies(player.getId());

		List<CollectionCardDto> cards = ownedByCard.entrySet().stream()
				.map(entry -> {
					OwnedCopies owned = entry.getValue();
					int quantity = owned.copies().size();
					return new CollectionCardDto(
							entry.getKey(),
							quantity,
							quantity,
							owned.inDeck(),
							false,
							false,
							false,
							null);
				})
				.toList();

		// Doppioni = copie che il riciclo accetterebbe adesso (no ultima copia, no copie nel Cielo)
		int duplicateCopies = 0;
		long duplicatesValue = 0;
		for (OwnedCopies owned : ownedByCard.values()) {
			duplicateCopies += owned.recyclable().size();
			duplicatesValue += recycleValue(owned.recyclable());
		}

		int creaturesDone = playerCardRepo
				.findOwnedCardDefinitionIdsByType(player.getId(), CardType.CREATURE)
				.size();
		int creaturesTotal = cardDefinitionRepo.findByType(CardType.CREATURE).size();

		int ascendantsDone = playerCardRepo
				.findOwnedCardDefinitionIdsByType(player.getId(), CardType.ASCENDANT)
				.size();
		int ascendantsTotal = cardDefinitionRepo.findByType(CardType.ASCENDANT).size();

		return new CollectionResponseDto(
				new CollectionProgressDto(
						new CollectionProgressGroupDto(creaturesDone, creaturesTotal),
						new CollectionProgressGroupDto(ascendantsDone, ascendantsTotal)),
				new CollectionDuplicatesDto(duplicateCopies, duplicatesValue),
				cards);
	}

	/**
	 * POST /api/collection/recycle. Crediti e collezione cambiano nella stessa transazione:
	 * se una voce non è riciclabile non si ricicla niente.
	 */
	@Override
	@Transactional
	public RecycleResponseDto recycle(Long appUserId, RecycleRequestDto request) {
		Map<Long, Integer> requested = requestedQuantities(request);

		// Lock sul giocatore prima di leggere le copie: due ricicli dello stesso giocatore
		// (anche un doppio clic) passano uno alla volta. player.id = appUser.id (@MapsId), come in ShopService
		Player player = playerRepo.findByForUpdate(appUserId)
				.orElseThrow(PlayerCardServiceImpl::playerNotFound);

		Map<Long, OwnedCopies> ownedByCard = ownedCopies(player.getId());

		List<PlayerCard> toRecycle = new ArrayList<>();
		if (requested == null) {
			ownedByCard.values().forEach(owned -> toRecycle.addAll(owned.recyclable()));
		} else {
			for (Map.Entry<Long, Integer> entry : requested.entrySet()) {
				OwnedCopies owned = ownedByCard.get(entry.getKey());
				List<PlayerCard> recyclable = owned == null ? List.of() : owned.recyclable();
				if (entry.getValue() > recyclable.size()) {
					throw cannotRecycle(entry.getKey(), entry.getValue(), recyclable.size());
				}
				toRecycle.addAll(recyclable.subList(0, entry.getValue()));
			}
		}

		long creditsGained = recycleValue(toRecycle);
		// Soft delete: valorizza recycled_at, la riga resta per lo storico (vedi PlayerCard)
		Instant now = Instant.now();
		toRecycle.forEach(copy -> copy.recycle(now));
		playerCardRepo.saveAll(toRecycle);
		player.setCredits(player.getCredits() + creditsGained);

		// TODO scambi (D-023): le proposte aperte che contengono una copia riciclata diventano
		// "non più valide" (nessun blocco) e si avvisa l'altro giocatore. Da integrare con il modulo
		// scambi in sviluppo: per ora non esistono proposte, quindi la lista è sempre vuota.
		List<Long> invalidatedTrades = List.of();

		return new RecycleResponseDto(creditsGained, player.getCredits(), invalidatedTrades);
	}

	// --- copie possedute ----------------------------------------------------------

	/**
	 * Copie del giocatore raggruppate per carta (ordine di prima acquisizione), con quali si possono riciclare:
	 * quelle fuori da ogni Cielo, lasciandone sempre almeno una. Si riciclano per prime le più recenti (id più alto).
	 */
	private Map<Long, OwnedCopies> ownedCopies(Long playerId) {
		Map<Long, List<PlayerCard>> copiesByCard = new LinkedHashMap<>();
		for (PlayerCard copy : playerCardRepo.findByPlayerId(playerId)) {
			copiesByCard.computeIfAbsent(copy.getCardDefinition().getId(), id -> new ArrayList<>()).add(copy);
		}

		Set<Long> copyIdsInDeck = new HashSet<>();
		for (Deck deck : deckRepo.findByPlayerId(playerId)) {
			if (deck.getAscendant() != null) {
				copyIdsInDeck.add(deck.getAscendant().getId());
			}
			for (PlayerCard copy : deck.getPlayerCards()) {
				copyIdsInDeck.add(copy.getId());
			}
		}

		Map<Long, OwnedCopies> owned = new LinkedHashMap<>();
		copiesByCard.forEach((cardId, copies) -> {
			List<PlayerCard> free = copies.stream()
					.filter(copy -> !copyIdsInDeck.contains(copy.getId()))
					.sorted(Comparator.comparing(PlayerCard::getId).reversed())
					.toList();
			int recyclable = Math.min(free.size(), copies.size() - 1);
			owned.put(cardId, new OwnedCopies(
					copies,
					free.size() < copies.size(),
					free.subList(0, recyclable)));
		});
		return owned;
	}

	private static long recycleValue(List<PlayerCard> copies) {
		return copies.stream()
				.mapToLong(copy -> CardRarity.of(copy.getCardDefinition()).getRecycleValue())
				.sum();
	}

	/**
	 * Quantità richieste per carta (cardId ripetuti si sommano), oppure null con { "all": true }.
	 * Serve esattamente una delle due modalità: IllegalArgumentException → 400 VALIDATION_ERROR.
	 */
	private static Map<Long, Integer> requestedQuantities(RecycleRequestDto request) {
		boolean hasItems = request.items() != null && !request.items().isEmpty();
		if (request.recycleAll() == hasItems) {
			throw new IllegalArgumentException("Indica le carte da riciclare (items) oppure all: true, non entrambi");
		}
		if (request.recycleAll()) {
			return null;
		}
		Map<Long, Integer> quantities = new LinkedHashMap<>();
		for (RecycleItemDto item : request.items()) {
			if (item == null) {
				throw new IllegalArgumentException("Voce di riciclo vuota");
			}
			quantities.merge(item.cardId(), item.quantity(), Integer::sum);
		}
		return quantities;
	}

	private static ApiException cannotRecycle(Long cardId, int requested, int recyclable) {
		return new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, ApiErrorCode.CANNOT_RECYCLE_LAST_COPY,
				"Carta " + cardId + ": richieste " + requested + " copie, riciclabili " + recyclable
						+ " (mai l'ultima copia, mai una copia nel Cielo)");
	}

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(PlayerCardServiceImpl::playerNotFound);
	}

	private static ResourceNotFoundException playerNotFound() {
		return new ResourceNotFoundException("Giocatore non trovato per l'utente corrente");
	}

	/** Copie di una carta: tutte, se almeno una è in un Cielo, e quelle riciclabili in ordine di riciclo. */
	private record OwnedCopies(List<PlayerCard> copies, boolean inDeck, List<PlayerCard> recyclable) {
	}
}
