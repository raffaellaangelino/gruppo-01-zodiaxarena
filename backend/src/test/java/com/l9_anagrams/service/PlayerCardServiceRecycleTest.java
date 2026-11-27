package com.l9_anagrams.service;

import static com.l9_anagrams.service.PackTestData.SIGN;
import static com.l9_anagrams.service.PackTestData.withId;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;

import com.l9_anagrams.dto.CollectionCardDto;
import com.l9_anagrams.dto.CollectionResponseDto;
import com.l9_anagrams.dto.RecycleItemDto;
import com.l9_anagrams.dto.RecycleRequestDto;
import com.l9_anagrams.dto.RecycleResponseDto;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.PlanetTier;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ApiException;
import com.l9_anagrams.repo.CardDefinitionRepo;
import com.l9_anagrams.repo.DeckRepo;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.impl.PlayerCardServiceImpl;

/**
 * Riciclo dei doppioni (Contratto API §4.4) e conteggio dei doppioni nella collezione.
 *
 * Collezione di prova:
 * - Comune 1: copie 10, 11, 12; la 10 è nel Cielo → riciclabili 12, 11 (prima la più recente)
 * - Leggendaria 2: solo la copia 20 → nessuna riciclabile (ultima copia)
 * - Ascendente 3: copie 30 (Ascendente del Cielo) e 31 → riciclabile 31
 * - Rara 4: copie 40 e 41, entrambe in un Cielo → nessuna riciclabile
 */
class PlayerCardServiceRecycleTest {

	private static final long PLAYER_ID = 1L;
	private static final long COMMON = 1L;
	private static final long LEGENDARY = 2L;
	private static final long ASCENDANT = 3L;
	private static final long RARE = 4L;

	private final PlayerCardRepo playerCardRepo = mock(PlayerCardRepo.class);
	private final PlayerRepo playerRepo = mock(PlayerRepo.class);
	private final CardDefinitionRepo cardDefinitionRepo = mock(CardDefinitionRepo.class);
	private final DeckRepo deckRepo = mock(DeckRepo.class);

	private final PlayerCardService service =
			new PlayerCardServiceImpl(playerCardRepo, playerRepo, cardDefinitionRepo, deckRepo);

	private final Player player = new Player();
	/** Tutte le copie create dal test, per controllare quali risultano riciclate. */
	private final List<PlayerCard> allCopies = new ArrayList<>();

	@BeforeEach
	void setUp() {
		player.setId(PLAYER_ID);
		player.setCredits(100);

		CardDefinition common = creature(COMMON, PlanetTier.COMMON);
		CardDefinition legendary = creature(LEGENDARY, PlanetTier.LEGENDARY);
		CardDefinition ascendant = withId(new CardDefinition(SIGN, "asc.png"), ASCENDANT);
		CardDefinition rare = creature(RARE, PlanetTier.RARE);

		PlayerCard c10 = copy(10, common);
		PlayerCard c11 = copy(11, common);
		PlayerCard c12 = copy(12, common);
		PlayerCard c20 = copy(20, legendary);
		PlayerCard c30 = copy(30, ascendant);
		PlayerCard c31 = copy(31, ascendant);
		PlayerCard c40 = copy(40, rare);
		PlayerCard c41 = copy(41, rare);

		Deck fire = deck(c30, c10, c40);
		Deck water = deck(null, c41);

		when(playerRepo.findByForUpdate(PLAYER_ID)).thenReturn(Optional.of(player));
		when(playerRepo.findByAppUserId(PLAYER_ID)).thenReturn(Optional.of(player));
		when(playerCardRepo.findByPlayerId(PLAYER_ID))
				.thenReturn(List.of(c10, c11, c12, c20, c30, c31, c40, c41));
		when(deckRepo.findByPlayerId(PLAYER_ID)).thenReturn(List.of(fire, water));
		when(playerCardRepo.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));
		when(playerCardRepo.findOwnedCardDefinitionIdsByType(anyLong(), any())).thenReturn(List.of());
		when(cardDefinitionRepo.findByType(any())).thenReturn(List.of());
	}

	// --- riciclo per voci -----------------------------------------------------------

	@Test
	void recyclesNewestFreeCopyAndAddsCredits() {
		RecycleResponseDto response = service.recycle(PLAYER_ID, items(item(COMMON, 1)));

		assertEquals(5, response.creditsGained());
		assertEquals(105, response.balance());
		assertEquals(105, player.getCredits());
		assertTrue(response.invalidatedTrades().isEmpty());
		assertEquals(List.of(12L), recycledIds());
	}

	@Test
	void repeatedCardIdsAreSummed() {
		RecycleResponseDto response = service.recycle(PLAYER_ID, items(item(COMMON, 1), item(COMMON, 1)));

		assertEquals(10, response.creditsGained());
		assertEquals(List.of(12L, 11L), recycledIds());
	}

	@Test
	void recyclesAcrossRaritiesWithTheirValues() {
		RecycleResponseDto response = service.recycle(PLAYER_ID, items(item(COMMON, 2), item(ASCENDANT, 1)));

		assertEquals(5 + 5 + 100, response.creditsGained());
		assertEquals(210, response.balance());
		assertEquals(List.of(12L, 11L, 31L), recycledIds());
	}

	@Test
	void neverTheLastCopy() {
		assertCannotRecycle(items(item(LEGENDARY, 1)));
	}

	@Test
	void neverACopyInTheSky() {
		// Due copie della Rara, entrambe nei Cieli: nessuna riciclabile anche se è un doppione
		assertCannotRecycle(items(item(RARE, 1)));
		// Tre Comuni ma la 10 è nel Cielo: se ne riciclano al massimo 2
		assertCannotRecycle(items(item(COMMON, 3)));
	}

	@Test
	void summedQuantityAboveRecyclableIsRejected() {
		assertCannotRecycle(items(item(COMMON, 2), item(COMMON, 1)));
	}

	@Test
	void cardNotOwnedIsRejected() {
		assertCannotRecycle(items(item(99L, 1)));
	}

	@Test
	void oneInvalidItemRecyclesNothing() {
		assertCannotRecycle(items(item(COMMON, 1), item(LEGENDARY, 1)));
	}

	// --- riciclo di tutto -----------------------------------------------------------

	@Test
	void allRecyclesEveryRecyclableCopy() {
		RecycleResponseDto response = service.recycle(PLAYER_ID, new RecycleRequestDto(null, true));

		assertEquals(110, response.creditsGained());
		assertEquals(210, response.balance());
		assertEquals(List.of(11L, 12L, 31L), recycledIds().stream().sorted().toList());
	}

	@Test
	void allWithNothingRecyclableGivesZero() {
		PlayerCard only = copy(50, creature(5L, PlanetTier.EPIC));
		when(playerCardRepo.findByPlayerId(PLAYER_ID)).thenReturn(List.of(only));

		RecycleResponseDto response = service.recycle(PLAYER_ID, new RecycleRequestDto(null, true));

		assertEquals(0, response.creditsGained());
		assertEquals(100, response.balance());
		assertTrue(recycledIds().isEmpty());
	}

	// --- richieste malformate -------------------------------------------------------

	@Test
	void requestNeedsExactlyOneMode() {
		assertBadRequest(new RecycleRequestDto(null, null));
		assertBadRequest(new RecycleRequestDto(List.of(), false));
		assertBadRequest(new RecycleRequestDto(List.of(item(COMMON, 1)), true));
		assertBadRequest(new RecycleRequestDto(new ArrayList<>(Arrays.asList((RecycleItemDto) null)), null));
	}

	// --- collezione -----------------------------------------------------------------

	@Test
	void collectionCountsOnlyRecyclableDuplicates() {
		CollectionResponseDto collection = service.getCollection(PLAYER_ID);

		assertEquals(3, collection.duplicates().copies());
		assertEquals(110, collection.duplicates().recycleValue());

		Map<Long, CollectionCardDto> cards = collection.cards().stream()
				.collect(Collectors.toMap(CollectionCardDto::cardId, card -> card));
		assertEquals(3, cards.get(COMMON).quantity());
		assertTrue(cards.get(COMMON).inDeck());
		assertTrue(cards.get(ASCENDANT).inDeck());
		assertTrue(cards.get(RARE).inDeck());
		assertEquals(false, cards.get(LEGENDARY).inDeck());
	}

	@Test
	void recycleValuesFollowContract() {
		assertEquals(5, CardRarity.COMMON.getRecycleValue());
		assertEquals(10, CardRarity.RARE.getRecycleValue());
		assertEquals(25, CardRarity.EPIC.getRecycleValue());
		assertEquals(60, CardRarity.LEGENDARY.getRecycleValue());
		assertEquals(100, CardRarity.ASCENDANT.getRecycleValue());
	}

	// --- supporto -------------------------------------------------------------------

	private void assertCannotRecycle(RecycleRequestDto request) {
		ApiException error = assertThrows(ApiException.class, () -> service.recycle(PLAYER_ID, request));
		assertEquals(HttpStatus.UNPROCESSABLE_CONTENT, error.getStatus());
		assertEquals(ApiErrorCode.CANNOT_RECYCLE_LAST_COPY, error.getCode());
		verify(playerCardRepo, never()).saveAll(any());
		assertTrue(allCopies.stream().noneMatch(PlayerCard::isRecycled));
		assertEquals(100, player.getCredits());
	}

	private void assertBadRequest(RecycleRequestDto request) {
		assertThrows(IllegalArgumentException.class, () -> service.recycle(PLAYER_ID, request));
		verify(playerRepo, never()).findByForUpdate(anyLong());
		verify(playerCardRepo, never()).saveAll(any());
	}

	/**
	 * Id delle copie riciclate (salvate con recycled_at valorizzato), nell'ordine di riciclo.
	 * Controlla anche che nessun'altra copia sia stata marcata.
	 */
	@SuppressWarnings("unchecked")
	private List<Long> recycledIds() {
		ArgumentCaptor<Iterable<PlayerCard>> captor = ArgumentCaptor.forClass(Iterable.class);
		verify(playerCardRepo).saveAll(captor.capture());
		List<PlayerCard> saved = StreamSupport.stream(captor.getValue().spliterator(), false).toList();
		assertTrue(saved.stream().allMatch(PlayerCard::isRecycled));
		assertEquals(saved.size(), allCopies.stream().filter(PlayerCard::isRecycled).count());
		return saved.stream().map(PlayerCard::getId).toList();
	}

	private static RecycleRequestDto items(RecycleItemDto... items) {
		return new RecycleRequestDto(List.of(items), null);
	}

	private static RecycleItemDto item(long cardId, int quantity) {
		return new RecycleItemDto(cardId, quantity);
	}

	private static CardDefinition creature(long id, PlanetTier tier) {
		return withId(new CardDefinition(SIGN, new Planet(tier.name(), tier, 1, 1), "card.png"), id);
	}

	private PlayerCard copy(long id, CardDefinition card) {
		PlayerCard copy = new PlayerCard(player, card);
		copy.setId(id);
		allCopies.add(copy);
		return copy;
	}

	private Deck deck(PlayerCard ascendant, PlayerCard... creatures) {
		Deck deck = new Deck();
		deck.setPlayer(player);
		deck.setAscendant(ascendant);
		deck.getPlayerCards().addAll(List.of(creatures));
		return deck;
	}
}
