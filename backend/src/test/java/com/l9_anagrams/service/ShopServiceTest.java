package com.l9_anagrams.service;

import static com.l9_anagrams.service.PackTestData.COSTELLAZIONE;
import static com.l9_anagrams.service.PackTestData.LAUNCH_ODDS;
import static com.l9_anagrams.service.PackTestData.LUNA_PIENA;
import static com.l9_anagrams.service.PackTestData.ZENIT;
import static com.l9_anagrams.service.PackTestData.creatures;
import static com.l9_anagrams.service.PackTestData.odds;
import static com.l9_anagrams.service.PackTestData.pack;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.SplittableRandom;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.l9_anagrams.dto.shop.PackOpeningResponseDto;
import com.l9_anagrams.dto.shop.PackOpeningResponseDto.OpenedCardDto;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.PackDefinition;
import com.l9_anagrams.entity.PackOpening;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.enums.PackGuarantee;
import com.l9_anagrams.enums.PackUnavailableReason;
import com.l9_anagrams.enums.PlanetTier;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ConflictException;
import com.l9_anagrams.repo.CardDefinitionRepo;
import com.l9_anagrams.repo.PackDefinitionRepo;
import com.l9_anagrams.repo.PackOpeningRepo;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;

class ShopServiceTest {

	private static final long PLAYER_ID = 1L;

	private final PlayerRepo playerRepo = mock(PlayerRepo.class);
	private final PackDefinitionRepo packDefinitionRepo = mock(PackDefinitionRepo.class);
	private final PackOpeningRepo packOpeningRepo = mock(PackOpeningRepo.class);
	private final CardDefinitionRepo cardDefinitionRepo = mock(CardDefinitionRepo.class);
	private final PlayerCardRepo playerCardRepo = mock(PlayerCardRepo.class);

	private final ShopService shop = new ShopService(playerRepo, packDefinitionRepo, packOpeningRepo,
			cardDefinitionRepo, playerCardRepo, new PackDrawer(), new SplittableRandom(42));

	private final Player player = new Player();
	private final PackDefinition costellazione = pack("COSTELLAZIONE", 100, COSTELLAZIONE, LAUNCH_ODDS);
	private final AtomicReference<PackOpening> saved = new AtomicReference<>();

	@BeforeEach
	void setUp() {
		player.setId(PLAYER_ID);
		player.setCredits(450);
		player.setPityCounter(3);
		when(playerRepo.findByForUpdate(PLAYER_ID)).thenReturn(Optional.of(player));
		when(packDefinitionRepo.findByCodeAndActiveTrue("COSTELLAZIONE")).thenReturn(Optional.of(costellazione));
		when(cardDefinitionRepo.findAll()).thenReturn(allCards(PackTestData.launchCatalog()));
		when(playerCardRepo.findOwnedCardDefinitionIds(PLAYER_ID)).thenReturn(List.of());
		when(playerCardRepo.saveAll(any())).thenAnswer(invocation -> invocation.getArgument(0));
		// Il "DB" delle aperture: findBy... restituisce quella salvata con save
		when(packOpeningRepo.findByPlayerIdAndIdempotencyKey(eq(PLAYER_ID), anyString()))
				.thenAnswer(invocation -> Optional.ofNullable(saved.get())
						.filter(opening -> opening.getIdempotencyKey().equals(invocation.getArgument(1))));
		when(packOpeningRepo.save(any())).thenAnswer(invocation -> {
			PackOpening opening = invocation.getArgument(0);
			opening.setId(501L);
			saved.set(opening);
			return opening;
		});
	}

	@Test
	void purchaseChargesCreditsAndSavesOpening() {
		PackOpeningResponseDto response = shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1");

		assertEquals(501L, response.openingId());
		assertEquals(5, response.cards().size());
		assertEquals(350, response.balance());
		assertEquals(350, player.getCredits());
		assertEquals(response.sunCounter().done(), player.getPityCounter());
		assertEquals(10, response.sunCounter().total());
		// Riciclo non ancora implementato: il campo del contratto c'è e vale 0
		response.cards().forEach(card -> assertEquals(0, card.recycleValue()));
		verify(playerCardRepo).saveAll(any());
	}

	@Test
	void sameIdempotencyKeyDoesNotBuyTwice() {
		PackOpeningResponseDto first = shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1");
		PackOpeningResponseDto second = shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1");

		assertEquals(first, second);
		assertEquals(350, player.getCredits());
		verify(playerCardRepo, times(1)).saveAll(any());
		verify(packOpeningRepo, times(1)).save(any());
	}

	@Test
	void sameIdempotencyKeyForAnotherPackIsAConflict() {
		shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1");
		ConflictException error = assertThrows(ConflictException.class,
				() -> shop.purchase(PLAYER_ID, "ZENIT", "key-1"));
		assertEquals(ApiErrorCode.CONFLICT, error.getCode());
	}

	@Test
	void insufficientCreditsChangesNothing() {
		player.setCredits(60);
		ConflictException error = assertThrows(ConflictException.class,
				() -> shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1"));

		assertEquals(ApiErrorCode.INSUFFICIENT_CREDITS, error.getCode());
		assertEquals(60, player.getCredits());
		assertEquals(3, player.getPityCounter());
		verify(playerCardRepo, never()).saveAll(any());
		verify(packOpeningRepo, never()).save(any());
	}

	@Test
	void missingIdempotencyKeyIsRejected() {
		assertThrows(IllegalArgumentException.class, () -> shop.purchase(PLAYER_ID, "COSTELLAZIONE", " "));
		assertThrows(IllegalArgumentException.class, () -> shop.purchase(PLAYER_ID, "COSTELLAZIONE", null));
		verify(playerRepo, never()).findByForUpdate(anyLong());
	}

	@Test
	void secondCopyInTheSamePackIsNotNew() {
		// Un solo tipo di Comune e di Rara: le tre Comuni sono la stessa carta, Rara e Stella pure
		long[] ids = { 100 };
		List<CardDefinition> catalog = new ArrayList<>();
		catalog.addAll(creatures(PlanetTier.COMMON, 1, ids));
		catalog.addAll(creatures(PlanetTier.RARE, 1, ids));
		when(cardDefinitionRepo.findAll()).thenReturn(catalog);
		PackDefinition alwaysRare = pack("COSTELLAZIONE", 100, COSTELLAZIONE, odds("1", "0", "0", "0"));
		when(packDefinitionRepo.findByCodeAndActiveTrue("COSTELLAZIONE")).thenReturn(Optional.of(alwaysRare));

		List<Boolean> isNew = shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1").cards().stream()
				.map(OpenedCardDto::isNew)
				.toList();

		assertEquals(List.of(true, false, false, true, false), isNew);
	}

	@Test
	void ownedCardIsNotNew() {
		when(playerCardRepo.findOwnedCardDefinitionIds(PLAYER_ID))
				.thenReturn(allCards(PackTestData.launchCatalog()).stream().map(CardDefinition::getId).toList());

		shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1").cards()
				.forEach(card -> assertEquals(false, card.isNew()));
	}

	@Test
	void guaranteesComeFromSlots() {
		assertEquals(List.of(PackGuarantee.SUN_WITHIN_10_STARS, PackGuarantee.NO_DUPLICATE_EPIC_LEGENDARY),
				ShopService.guarantees(costellazione));
		assertEquals(List.of(PackGuarantee.SUN_WITHIN_10_STARS, PackGuarantee.NO_DUPLICATE_EPIC_LEGENDARY,
				PackGuarantee.EPIC), ShopService.guarantees(pack("ZENIT", 250, ZENIT, LAUNCH_ODDS)));
		assertEquals(List.of(PackGuarantee.SUN_WITHIN_10_STARS, PackGuarantee.NO_DUPLICATE_EPIC_LEGENDARY,
				PackGuarantee.EPIC, PackGuarantee.ASCENDANT),
				ShopService.guarantees(pack("LUNA_PIENA", 600, LUNA_PIENA, LAUNCH_ODDS)));
	}

	@Test
	void unavailabilityReasons() {
		Instant now = Instant.now();
		assertNull(ShopService.unavailability(costellazione, player, now));

		player.setCredits(99);
		assertEquals(PackUnavailableReason.INSUFFICIENT_CREDITS,
				ShopService.unavailability(costellazione, player, now).reason());

		Instant release = now.plus(3, ChronoUnit.DAYS);
		costellazione.setReleasedAt(release);
		ShopService.Unavailability notReleased = ShopService.unavailability(costellazione, player, now);
		assertEquals(PackUnavailableReason.NOT_YET_RELEASED, notReleased.reason());
		assertEquals(release, notReleased.availableAgainAt());
	}

	@Test
	void notYetReleasedCannotBeBought() {
		costellazione.setReleasedAt(Instant.now().plus(1, ChronoUnit.DAYS));
		ConflictException error = assertThrows(ConflictException.class,
				() -> shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1"));
		assertEquals(ApiErrorCode.NOT_YET_RELEASED, error.getCode());
		assertEquals(450, player.getCredits());
	}

	@Test
	void wrongStarOddsAreAConfigurationError() {
		PackDefinition broken = pack("COSTELLAZIONE", 100, COSTELLAZIONE, odds("0.50", "0.30", "0.08", "0.02"));
		when(packDefinitionRepo.findByCodeAndActiveTrue("COSTELLAZIONE")).thenReturn(Optional.of(broken));
		assertThrows(IllegalStateException.class, () -> shop.purchase(PLAYER_ID, "COSTELLAZIONE", "key-1"));
		verify(playerCardRepo, never()).saveAll(any());
	}

	private static List<CardDefinition> allCards(java.util.Map<?, List<CardDefinition>> catalog) {
		return catalog.values().stream().flatMap(List::stream).toList();
	}
}
