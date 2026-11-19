package com.l9_anagrams.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.DeckRequestDto;
import com.l9_anagrams.dto.DeckResponseDto;
import com.l9_anagrams.dto.DeckValidationDto;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.CardType;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.exception.RuleViolationException;
import com.l9_anagrams.repo.DeckRepo;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.DeckService;

@Service
public class DeckServiceImpl implements DeckService {

	// Regolamento v2: valori fissi delle regole di mazzo
	private static final int DECK_SIZE = 7;
	private static final int MIN_PER_ELEMENT = 1;
	private static final int MAX_PER_ELEMENT = 3;

	private final DeckRepo deckRepo;
	private final PlayerRepo playerRepo;
	private final PlayerCardRepo playerCardRepo;

	public DeckServiceImpl(DeckRepo deckRepo, PlayerRepo playerRepo, PlayerCardRepo playerCardRepo) {
		this.deckRepo = deckRepo;
		this.playerRepo = playerRepo;
		this.playerCardRepo = playerCardRepo;
	}

	@Override
	@Transactional(readOnly = true)
	public List<DeckResponseDto> getAll() {
		return deckRepo.findAll().stream().map(DeckResponseDto::from).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<DeckResponseDto> getMine(String email) {
		Player player = currentPlayer(email);
		return deckRepo.findByPlayerId(player.getId()).stream().map(DeckResponseDto::from).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public DeckResponseDto getById(Long id, String email) {
		return DeckResponseDto.from(ownedDeck(id, currentPlayer(email)));
	}

	@Override
	@Transactional(readOnly = true)
	public DeckValidationDto validate(String email, DeckRequestDto request) {
		Checked result = check(currentPlayer(email), request);
		return new DeckValidationDto(result.violations.isEmpty(), result.violations);
	}

	@Override
	@Transactional(readOnly = true)
	public DeckValidationDto validateDeck(Player player, Deck deck) {
		DeckRequestDto request = new DeckRequestDto(
				deck.getName(),
				deck.getAscendant() == null ? null : deck.getAscendant().getId(),
				deck.getPlayerCards().stream().map(card -> card.getId()).toList());
		Checked result = check(player, request);
		return new DeckValidationDto(result.violations.isEmpty(), result.violations);
	}

	@Override
	@Transactional
	public DeckResponseDto create(String email, DeckRequestDto request) {
		Player player = currentPlayer(email);
		Checked result = check(player, request);
		if (!result.violations.isEmpty()) {
			throw new RuleViolationException(result.violations);
		}

		Deck deck = new Deck();
		deck.setPlayer(player);
		apply(deck, request, result);
		return DeckResponseDto.from(deckRepo.save(deck));
	}

	@Override
	@Transactional
	public DeckResponseDto update(Long id, String email, DeckRequestDto request) {
		Player player = currentPlayer(email);
		Deck deck = ownedDeck(id, player);
		Checked result = check(player, request);
		if (!result.violations.isEmpty()) {
			throw new RuleViolationException(result.violations);
		}

		apply(deck, request, result);
		return DeckResponseDto.from(deckRepo.save(deck));
	}

	@Override
	@Transactional
	public void delete(Long id, String email) {
		Deck deck = ownedDeck(id, currentPlayer(email));
		// TODO: quando esisteranno le sfide, impedire la cancellazione di un mazzo
		// usato in una sfida in attesa
		deckRepo.delete(deck);
	}

	// ---------------------------------------------------------------- helper

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}

	private Deck ownedDeck(Long id, Player player) {
		return deckRepo.findByIdAndPlayerId(id, player.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Mazzo non trovato"));
	}

	private void apply(Deck deck, DeckRequestDto request, Checked result) {
		deck.setName(request.name().trim());
		deck.setAscendant(result.ascendant);
		deck.getPlayerCards().clear();
		deck.getPlayerCards().addAll(result.cards);
	}

	/** Esito del controllo: regole violate e carte già caricate dal database. */
	private static class Checked {
		private final List<String> violations = new ArrayList<>();
		private PlayerCard ascendant;
		private List<PlayerCard> cards = List.of();
	}

	/** Regole V1-V8 del regolamento v2. Raccoglie tutte le violazioni, non solo la prima. */
	private Checked check(Player player, DeckRequestDto request) {
		Checked result = new Checked();
		List<String> v = result.violations;

		if (request.name() == null || request.name().isBlank()) {
			v.add("Il mazzo deve avere un nome");
		}

		// V1: casa (Dio) scelta sull'account
		if (player.getGod() == null) {
			v.add("V1: il giocatore non ha ancora scelto una casa (Dio)");
		}

		List<Long> cardIds = request.playerCardIds() == null ? List.of() : request.playerCardIds();

		// V3: esattamente 7 carte di gioco
		if (cardIds.size() != DECK_SIZE) {
			v.add("V3: servono esattamente " + DECK_SIZE + " carte di gioco");
		}
		// stessa carta indicata due volte
		if (new HashSet<>(cardIds).size() != cardIds.size()) {
			v.add("V5: la stessa carta compare più volte nel mazzo");
		}
		// V2: esattamente 1 Ascendente
		if (request.ascendantId() == null) {
			v.add("V2: serve esattamente 1 Ascendente");
		}

		// V6: possesso. Una sola query per carte di gioco e Ascendente
		Set<Long> wanted = new HashSet<>(cardIds);
		if (request.ascendantId() != null) {
			wanted.add(request.ascendantId());
		}
		Map<Long, PlayerCard> owned = wanted.isEmpty() ? Map.of()
				: playerCardRepo.findByIdInAndPlayerId(wanted, player.getId()).stream()
						.collect(Collectors.toMap(PlayerCard::getId, Function.identity()));
		if (owned.size() != wanted.size()) {
			v.add("V6: il giocatore non possiede tutte le carte indicate");
		}

		// V2: la carta scelta deve essere davvero un Ascendente
		if (request.ascendantId() != null) {
			PlayerCard ascendant = owned.get(request.ascendantId());
			if (ascendant != null) {
				if (ascendant.getCardDefinition().getType() != CardType.ASCENDANT) {
					v.add("V2: la carta scelta come Ascendente non è un Ascendente");
				} else {
					result.ascendant = ascendant;
				}
			}
		}

		List<PlayerCard> cards = cardIds.stream().distinct().map(owned::get).filter(Objects::nonNull).toList();
		result.cards = cards;

		// V7: ogni carta di gioco è una creatura con un pianeta
		boolean allCreatures = cards.stream().allMatch(c -> c.getCardDefinition().getType() == CardType.CREATURE
				&& c.getCardDefinition().getPlanet() != null);
		if (!allCreatures) {
			v.add("V7: le carte di gioco devono essere creature con un pianeta");
			return result;
		}

		// V4: un pianeta per slot
		Set<Long> planets = cards.stream()
				.map(c -> c.getCardDefinition().getPlanet().getId())
				.collect(Collectors.toSet());
		if (planets.size() != cards.size()) {
			v.add("V4: serve esattamente 1 carta per ciascun pianeta");
		}

		// V5: nessuna carta (pianeta + segno) ripetuta
		Set<Long> definitions = cards.stream()
				.map(c -> c.getCardDefinition().getId())
				.collect(Collectors.toSet());
		if (definitions.size() != cards.size()) {
			v.add("V5: nessuna carta (pianeta + segno) può essere ripetuta");
		}

		// V8: da 1 a 3 carte per elemento (solo a mazzo completo)
		if (cards.size() == DECK_SIZE) {
			Map<SignType, Long> perElement = cards.stream().collect(
					Collectors.groupingBy(c -> c.getCardDefinition().getSign().getType(), Collectors.counting()));
			for (SignType type : SignType.values()) {
				long n = perElement.getOrDefault(type, 0L);
				if (n < MIN_PER_ELEMENT || n > MAX_PER_ELEMENT) {
					v.add("V8: l'elemento " + type + " ha " + n + " carte (ne servono da "
							+ MIN_PER_ELEMENT + " a " + MAX_PER_ELEMENT + ")");
				}
			}
		}
		return result;
	}
}
