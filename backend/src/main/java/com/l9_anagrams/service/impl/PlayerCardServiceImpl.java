package com.l9_anagrams.service.impl;

import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.CollectionCardDto;
import com.l9_anagrams.dto.CollectionDuplicatesDto;
import com.l9_anagrams.dto.CollectionProgressDto;
import com.l9_anagrams.dto.CollectionProgressGroupDto;
import com.l9_anagrams.dto.CollectionResponseDto;
import com.l9_anagrams.dto.PlayerCardResponseDto;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.enums.CardType;
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
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));

		List<PlayerCard> ownedCards = playerCardRepo.findByPlayerId(player.getId());

		Map<Long, List<PlayerCard>> cardsByDefinition = new LinkedHashMap<>();
		for (PlayerCard ownedCard : ownedCards) {
			Long cardDefinitionId = ownedCard.getCardDefinition().getId();
			cardsByDefinition.computeIfAbsent(cardDefinitionId, id -> new java.util.ArrayList<>())
					.add(ownedCard);
		}

		Set<Long> playerCardIdsInDeck = new HashSet<>();
		for (Deck deck : deckRepo.findByPlayerId(player.getId())) {
			if (deck.getAscendant() != null) {
				playerCardIdsInDeck.add(deck.getAscendant().getId());
			}
			for (PlayerCard card : deck.getPlayerCards()) {
				playerCardIdsInDeck.add(card.getId());
			}
		}

		List<CollectionCardDto> cards = cardsByDefinition.entrySet().stream()
				.map(entry -> {
					List<PlayerCard> copies = entry.getValue();
					int quantity = copies.size();
					boolean inDeck = copies.stream()
							.anyMatch(copy -> playerCardIdsInDeck.contains(copy.getId()));

					return new CollectionCardDto(
							entry.getKey(),
							quantity,
							quantity,
							inDeck,
							false,
							false,
							false,
							null);
				})
				.toList();

		int duplicateCopies = cards.stream()
				.mapToInt(card -> Math.max(0, card.quantity() - 1))
				.sum();

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
				new CollectionDuplicatesDto(duplicateCopies, 0),
				cards);
	}

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}
}