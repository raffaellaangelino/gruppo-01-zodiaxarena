package com.l9_anagrams.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.random.RandomGenerator;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.shop.PackOpeningResponseDto;
import com.l9_anagrams.dto.shop.PackOpeningResponseDto.OpenedCardDto;
import com.l9_anagrams.dto.shop.ShopPacksResponseDto;
import com.l9_anagrams.dto.shop.ShopPacksResponseDto.PackDto;
import com.l9_anagrams.dto.shop.SunCounterDto;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.PackDefinition;
import com.l9_anagrams.entity.PackOpening;
import com.l9_anagrams.entity.PackOpeningCard;
import com.l9_anagrams.entity.PackSlot;
import com.l9_anagrams.entity.PackStarOdds;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.enums.CardRarity;
import com.l9_anagrams.enums.PackGuarantee;
import com.l9_anagrams.enums.PackPurchaseLimit;
import com.l9_anagrams.enums.PackSlotType;
import com.l9_anagrams.enums.PackUnavailableReason;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ConflictException;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.repo.CardDefinitionRepo;
import com.l9_anagrams.repo.PackDefinitionRepo;
import com.l9_anagrams.repo.PackOpeningRepo;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.PackDrawer.DrawResult;
import com.l9_anagrams.service.PackDrawer.DrawnCard;

/**
 * Negozio dei pacchetti (Contratto API §6). Il giocatore si identifica per id:
 * è l'userId del token, uguale a player.id (@MapsId).
 */
@Service
public class ShopService {

	private static final int MAX_IDEMPOTENCY_KEY_LENGTH = 64;

	private final PlayerRepo playerRepo;
	private final PackDefinitionRepo packDefinitionRepo;
	private final PackOpeningRepo packOpeningRepo;
	private final CardDefinitionRepo cardDefinitionRepo;
	private final PlayerCardRepo playerCardRepo;
	private final PackDrawer packDrawer;
	private final RandomGenerator random;

	public ShopService(
			PlayerRepo playerRepo,
			PackDefinitionRepo packDefinitionRepo,
			PackOpeningRepo packOpeningRepo,
			CardDefinitionRepo cardDefinitionRepo,
			PlayerCardRepo playerCardRepo,
			PackDrawer packDrawer,
			RandomGenerator random) {
		this.playerRepo = playerRepo;
		this.packDefinitionRepo = packDefinitionRepo;
		this.packOpeningRepo = packOpeningRepo;
		this.cardDefinitionRepo = cardDefinitionRepo;
		this.playerCardRepo = playerCardRepo;
		this.packDrawer = packDrawer;
		this.random = random;
	}

	/** GET /api/shop/packs */
	@Transactional(readOnly = true)
	public ShopPacksResponseDto listPacks(Long playerId) {
		Player player = playerRepo.findById(playerId).orElseThrow(ShopService::playerNotFound);
		Instant now = Instant.now();
		List<PackDto> packs = packDefinitionRepo.findByActiveTrueOrderBySortOrderAsc().stream()
				.map(pack -> toPackDto(pack, player, now))
				.toList();
		return new ShopPacksResponseDto(player.getCredits(), sunCounter(player.getPityCounter()), packs);
	}

	/**
	 * POST /api/shop/packs/{code}/purchase. Paga e apre nella stessa transazione:
	 * se qualcosa fallisce, crediti e collezione restano come prima.
	 */
	@Transactional
	public PackOpeningResponseDto purchase(Long playerId, String code, String idempotencyKey) {
		String key = requireIdempotencyKey(idempotencyKey);

		// Lock sul giocatore: le richieste dello stesso giocatore (anche un doppio clic) passano una alla volta
		Player player = playerRepo.findByForUpdate(playerId).orElseThrow(ShopService::playerNotFound);

		PackOpening previous = packOpeningRepo.findByPlayerIdAndIdempotencyKey(playerId, key).orElse(null);
		if (previous != null) {
			if (!previous.getPack().getCode().equals(code)) {
				throw new ConflictException("Idempotency-Key già usata per un altro pacchetto");
			}
			// Stesso tentativo ripetuto: stessa apertura, nessun nuovo addebito
			return toResponse(previous);
		}

		PackDefinition pack = packDefinitionRepo.findByCodeAndActiveTrue(code)
				.orElseThrow(() -> new ResourceNotFoundException("Pacchetto non trovato"));
		Unavailability unavailable = unavailability(pack, player, Instant.now());
		if (unavailable != null) {
			throw unavailableException(unavailable.reason(), pack, player);
		}

		Map<CardRarity, BigDecimal> starOdds = starOdds(pack);
		requireValidStarOdds(pack, starOdds);

		Map<CardRarity, List<CardDefinition>> pool = cardDefinitionRepo.findAll().stream()
				.collect(Collectors.groupingBy(CardRarity::of, () -> new EnumMap<>(CardRarity.class), Collectors.toList()));
		Set<Long> owned = new HashSet<>(playerCardRepo.findOwnedCardDefinitionIds(playerId));

		DrawResult draw = packDrawer.draw(pack.getSlots(), starOdds, pool, owned, player.getPityCounter(), random);

		List<PlayerCard> copies = playerCardRepo.saveAll(draw.cards().stream()
				.map(drawn -> new PlayerCard(player, drawn.card()))
				.toList());

		player.setCredits(player.getCredits() - pack.getPrice());
		player.setPityCounter(draw.pityAfter());

		PackOpening opening = new PackOpening();
		opening.setPlayer(player);
		opening.setPack(pack);
		opening.setIdempotencyKey(key);
		opening.setPricePaid(pack.getPrice());
		opening.setBalanceAfter(player.getCredits());
		opening.setSunCounterAfter(draw.pityAfter());
		opening.setSunFound(draw.sunFound());

		// Nuova = non posseduta prima e non già uscita in questo pacchetto
		Set<Long> seen = new HashSet<>(owned);
		for (int i = 0; i < draw.cards().size(); i++) {
			DrawnCard drawn = draw.cards().get(i);
			PackOpeningCard card = new PackOpeningCard();
			card.setOpening(opening);
			card.setSlotNumber(drawn.slotNumber());
			card.setSlotType(drawn.slotType());
			card.setCardDefinition(drawn.card());
			card.setPlayerCard(copies.get(i));
			card.setNewCard(seen.add(drawn.card().getId()));
			opening.getCards().add(card);
		}
		return toResponse(packOpeningRepo.save(opening));
	}

	/** GET /api/shop/openings/{openingId}: riepilogo di un'apertura interrotta. */
	@Transactional(readOnly = true)
	public PackOpeningResponseDto getOpening(Long playerId, Long openingId) {
		return packOpeningRepo.findByIdAndPlayerId(openingId, playerId)
				.map(ShopService::toResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Apertura non trovata"));
	}

	// --- catalogo ---------------------------------------------------------------

	private PackDto toPackDto(PackDefinition pack, Player player, Instant now) {
		Unavailability unavailable = unavailability(pack, player, now);
		return new PackDto(
				pack.getCode(),
				pack.getName(),
				pack.getRole(),
				pack.getPrice(),
				pack.getSlots().size(),
				pack.getSlots().stream().map(PackSlot::getSlotType).toList(),
				starOdds(pack),
				guarantees(pack),
				pack.getPurchaseLimit() == PackPurchaseLimit.NONE ? null : pack.getPurchaseLimit(),
				unavailable == null,
				unavailable == null ? null : unavailable.reason(),
				unavailable == null ? null : unavailable.availableAgainAt());
	}

	/** Ricavate dagli slot: non possono promettere ciò che il pacchetto non contiene. */
	static List<PackGuarantee> guarantees(PackDefinition pack) {
		Set<PackSlotType> types = pack.getSlots().stream()
				.map(PackSlot::getSlotType)
				.collect(Collectors.toCollection(() -> EnumSet.noneOf(PackSlotType.class)));
		List<PackGuarantee> guarantees = new ArrayList<>();
		if (types.contains(PackSlotType.STAR)) {
			guarantees.add(PackGuarantee.SUN_WITHIN_10_STARS);
			guarantees.add(PackGuarantee.NO_DUPLICATE_EPIC_LEGENDARY);
		}
		if (types.contains(PackSlotType.EPIC)) {
			guarantees.add(PackGuarantee.EPIC);
		}
		if (types.contains(PackSlotType.LEGENDARY)) {
			guarantees.add(PackGuarantee.LEGENDARY);
		}
		if (types.contains(PackSlotType.ASCENDANT)) {
			guarantees.add(PackGuarantee.ASCENDANT);
		}
		return guarantees;
	}

	/** Motivo per cui il pacchetto non si compra ora, o null se si può comprare. */
	static Unavailability unavailability(PackDefinition pack, Player player, Instant now) {
		if (pack.getReleasedAt() != null && pack.getReleasedAt().isAfter(now)) {
			return new Unavailability(PackUnavailableReason.NOT_YET_RELEASED, pack.getReleasedAt());
		}
		// TODO ciclo lunare: per ONCE_PER_LUNAR_CYCLE, se packOpeningRepo
		// .findFirstByPlayerIdAndPackIdOrderByOpenedAtDesc cade nel ciclo corrente →
		// LIMIT_REACHED con availableAgainAt = inizio del ciclo successivo. Per ora il limite non ha effetto.
		if (player.getCredits() < pack.getPrice()) {
			return new Unavailability(PackUnavailableReason.INSUFFICIENT_CREDITS, null);
		}
		return null;
	}

	private static ConflictException unavailableException(
			PackUnavailableReason reason, PackDefinition pack, Player player) {
		return switch (reason) {
			case INSUFFICIENT_CREDITS -> new ConflictException(ApiErrorCode.INSUFFICIENT_CREDITS,
					"Crediti insufficienti: mancano " + (pack.getPrice() - player.getCredits()));
			case LIMIT_REACHED -> new ConflictException(ApiErrorCode.LIMIT_REACHED,
					"Pacchetto già aperto in questo ciclo lunare");
			case NOT_YET_RELEASED -> new ConflictException(ApiErrorCode.NOT_YET_RELEASED,
					"Pacchetto non ancora disponibile");
		};
	}

	private static Map<CardRarity, BigDecimal> starOdds(PackDefinition pack) {
		Map<CardRarity, BigDecimal> odds = new EnumMap<>(CardRarity.class);
		for (PackStarOdds row : pack.getStarOdds()) {
			odds.put(row.getRarity(), row.getProbability().stripTrailingZeros());
		}
		return odds;
	}

	/** Un errore di configurazione del backoffice non deve far pagare un pacchetto pescato male. */
	private static void requireValidStarOdds(PackDefinition pack, Map<CardRarity, BigDecimal> odds) {
		boolean hasStar = pack.getSlots().stream().anyMatch(slot -> slot.getSlotType().isStar());
		if (!hasStar) {
			return;
		}
		BigDecimal sum = odds.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
		if (sum.compareTo(BigDecimal.ONE) != 0) {
			throw new IllegalStateException(
					"Le probabilità della Stella di " + pack.getCode() + " sommano a " + sum + " invece di 1");
		}
	}

	// --- risposte ---------------------------------------------------------------

	private static PackOpeningResponseDto toResponse(PackOpening opening) {
		List<OpenedCardDto> cards = opening.getCards().stream()
				.map(card -> new OpenedCardDto(
						card.getSlotNumber(),
						card.getSlotType(),
						card.getCardDefinition().getId(),
						card.isNewCard(),
						0)) // TODO riciclo non ancora implementato: valore fisso come nella collezione
				.toList();
		return new PackOpeningResponseDto(
				opening.getId(),
				cards,
				opening.getBalanceAfter(),
				sunCounter(opening.getSunCounterAfter()),
				opening.isSunFound());
	}

	private static SunCounterDto sunCounter(int done) {
		return new SunCounterDto(done, PackDrawer.SUN_GUARANTEE_STARS);
	}

	private static String requireIdempotencyKey(String key) {
		String trimmed = key == null ? "" : key.trim();
		if (trimmed.isEmpty() || trimmed.length() > MAX_IDEMPOTENCY_KEY_LENGTH) {
			// IllegalArgumentException → 400 VALIDATION_ERROR (GlobalExceptionHandler)
			throw new IllegalArgumentException(
					"Header Idempotency-Key obbligatorio (1-" + MAX_IDEMPOTENCY_KEY_LENGTH + " caratteri)");
		}
		return trimmed;
	}

	private static ResourceNotFoundException playerNotFound() {
		return new ResourceNotFoundException("Giocatore non trovato");
	}

	record Unavailability(PackUnavailableReason reason, Instant availableAgainAt) {
	}
}
