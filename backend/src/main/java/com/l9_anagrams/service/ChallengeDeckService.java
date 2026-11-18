package com.l9_anagrams.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.DeckValidationDto;
import com.l9_anagrams.entity.ChallengeDeckCardSnapshot;
import com.l9_anagrams.entity.ChallengeDeckSnapshot;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.exception.RuleViolationException;
import com.l9_anagrams.repo.DeckRepo;

@Service
public class ChallengeDeckService {
	private final DeckRepo deckRepo;
	private final DeckService deckService;

	public ChallengeDeckService(DeckRepo deckRepo, DeckService deckService) {
		this.deckRepo = deckRepo;
		this.deckService = deckService;
	}

	@Transactional(readOnly = true)
	public ChallengeDeckSnapshot snapshotOwnedDeck(Player player, Long deckId) {
		Deck deck = deckRepo.findByIdAndPlayerId(deckId, player.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Mazzo non trovato"));

		DeckValidationDto validation = deckService.validateDeck(player, deck);
		if (!validation.valid()) {
			throw new RuleViolationException(validation.violations());
		}

		ChallengeDeckSnapshot snapshot = new ChallengeDeckSnapshot();
		snapshot.setCapturedAt(LocalDateTime.now());
		snapshot.setGod(player.getGod());
		snapshot.setAscendantCardDefinition(
				deck.getAscendant() == null ? null : deck.getAscendant().getCardDefinition());

		List<ChallengeDeckCardSnapshot> cards = new ArrayList<>();
		for (int position = 0; position < deck.getPlayerCards().size(); position++) {
			ChallengeDeckCardSnapshot card = new ChallengeDeckCardSnapshot();
			card.setDeckSnapshot(snapshot);
			card.setCardDefinition(deck.getPlayerCards().get(position).getCardDefinition());
			card.setPosition(position);
			cards.add(card);
		}
		snapshot.setCardSnapshots(cards);
		return snapshot;
	}
}
