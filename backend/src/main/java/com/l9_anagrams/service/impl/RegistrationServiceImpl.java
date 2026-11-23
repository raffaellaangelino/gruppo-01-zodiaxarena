package com.l9_anagrams.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Pattern;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.auth.AppUserRepo;
import com.l9_anagrams.auth.dto.NicknameAvailabilityResponseDto;
import com.l9_anagrams.auth.dto.RegisterRequestDto;
import com.l9_anagrams.auth.dto.RegistrationPreviewResponseDto;
import com.l9_anagrams.dto.PlayerResponseDto;
import com.l9_anagrams.entity.AppUser;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.Deck;
import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.CardType;
import com.l9_anagrams.enums.God;
import com.l9_anagrams.enums.OnboardingStep;
import com.l9_anagrams.enums.Role;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ConflictException;
import com.l9_anagrams.repo.CardDefinitionRepo;
import com.l9_anagrams.repo.DeckRepo;
import com.l9_anagrams.repo.PlanetRepo;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.repo.SignRepo;
import com.l9_anagrams.service.RegistrationService;
import com.l9_anagrams.service.SunSignCalculator;

@Service
public class RegistrationServiceImpl implements RegistrationService {
	private static final long WELCOME_CREDITS = 300;
	private static final String SUN_PLANET_NAME = "Sole";
	private static final String INITIAL_DECK_NAME = "Primo cielo";
	private static final Pattern NICKNAME_PATTERN = Pattern.compile("[A-Za-z0-9_]{3,16}");

	private final AppUserRepo appUserRepo;
	private final PlayerRepo playerRepo;
	private final SignRepo signRepo;
	private final PlanetRepo planetRepo;
	private final CardDefinitionRepo cardDefinitionRepo;
	private final PlayerCardRepo playerCardRepo;
	private final DeckRepo deckRepo;
	private final PasswordEncoder passwordEncoder;
	private final SunSignCalculator sunSignCalculator;

	public RegistrationServiceImpl(
			AppUserRepo appUserRepo,
			PlayerRepo playerRepo,
			SignRepo signRepo,
			PlanetRepo planetRepo,
			CardDefinitionRepo cardDefinitionRepo,
			PlayerCardRepo playerCardRepo,
			DeckRepo deckRepo,
			PasswordEncoder passwordEncoder,
			SunSignCalculator sunSignCalculator) {
		this.appUserRepo = appUserRepo;
		this.playerRepo = playerRepo;
		this.signRepo = signRepo;
		this.planetRepo = planetRepo;
		this.cardDefinitionRepo = cardDefinitionRepo;
		this.playerCardRepo = playerCardRepo;
		this.deckRepo = deckRepo;
		this.passwordEncoder = passwordEncoder;
		this.sunSignCalculator = sunSignCalculator;
	}

	@Override
	@Transactional
	public RegistrationResult register(RegisterRequestDto request) {
		if (!request.acceptedTerms() || !request.ageConfirmed()) {
			throw new IllegalArgumentException("Terms and age confirmation are required");
		}
		requirePastBirthDate(request.birthDate());

		String email = request.email().trim().toLowerCase(Locale.ROOT);
		String nickName = request.nickName().trim().toLowerCase(Locale.ROOT);
		if (!NICKNAME_PATTERN.matcher(nickName).matches()) {
			throw new IllegalArgumentException("Nickname must be 3-16 letters, numbers, or underscores");
		}
		if (appUserRepo.existsByEmailIgnoreCase(email)) {
			throw new ConflictException(ApiErrorCode.EMAIL_TAKEN, "Email already registered");
		}
		if (playerRepo.existsByNickNameIgnoreCase(nickName)) {
			throw new ConflictException(ApiErrorCode.NICKNAME_TAKEN, "Nickname already in use");
		}

		Sign sunSign = signRepo.findByName(sunSignCalculator.calculateName(request.birthDate()))
				.orElseThrow(() -> new IllegalStateException("Sun sign seed data is missing"));
		List<Planet> planets = planetRepo.findAll();
		if (planets.size() != 7) {
			throw new IllegalStateException("Expected exactly seven seeded planets");
		}
		Planet sun = planets.stream()
				.filter(planet -> SUN_PLANET_NAME.equals(planet.getName()))
				.findFirst()
				.orElseThrow(() -> new IllegalStateException("Sun planet seed data is missing"));

		AppUser user = new AppUser();
		user.setEmail(email);
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole(Role.USER);
		try {
			appUserRepo.saveAndFlush(user);
		} catch (DataIntegrityViolationException exception) {
			throw new ConflictException(ApiErrorCode.EMAIL_TAKEN, "Email already registered");
		}

		Player player = new Player(user, nickName);
		player.setSunSign(sunSign);
		player.setCredits(WELCOME_CREDITS);
		player.setOnboardingStep(OnboardingStep.FACTION);
		try {
			playerRepo.saveAndFlush(player);
		} catch (DataIntegrityViolationException exception) {
			throw new ConflictException(ApiErrorCode.NICKNAME_TAKEN, "Nickname already in use");
		}

		List<StarterCard> starterCards = selectStarterCards(planets, sun, sunSign);
		List<PlayerCard> ownedCards = new ArrayList<>(starterCards.size());
		for (StarterCard starterCard : starterCards) {
			CardDefinition definition = cardDefinitionRepo
					.findByPlanetIdAndSignId(starterCard.planet().getId(), starterCard.sign().getId())
					.orElseThrow(() -> new IllegalStateException("Starter creature seed data is missing"));
			ownedCards.add(new PlayerCard(player, definition));
		}
		ownedCards = playerCardRepo.saveAll(ownedCards);
		player.getPlayerCards().addAll(ownedCards);

		List<CardDefinition> ascendants = cardDefinitionRepo.findByType(CardType.ASCENDANT);
		if (ascendants.isEmpty()) {
			throw new IllegalStateException("Ascendant seed data is missing");
		}
		CardDefinition randomAscendant = ascendants.get(ThreadLocalRandom.current().nextInt(ascendants.size()));
		PlayerCard ownedAscendant = playerCardRepo.save(new PlayerCard(player, randomAscendant));
		player.getPlayerCards().add(ownedAscendant);

		Deck deck = new Deck();
		deck.setName(INITIAL_DECK_NAME);
		deck.setPlayer(player);
		deck.setAscendant(ownedAscendant);
		deck.getPlayerCards().addAll(ownedCards);
		deckRepo.save(deck);
		player.getDecks().add(deck);

		return new RegistrationResult(
				PlayerResponseDto.from(player),
				proposedFaction(sunSign.getType()),
				user.getEmail());
	}

	@Override
	@Transactional(readOnly = true)
	public RegistrationPreviewResponseDto preview(LocalDate birthDate) {
		requirePastBirthDate(birthDate);
		String sunSignName = sunSignCalculator.calculateName(birthDate);
		Sign sunSign = signRepo.findByName(sunSignName)
				.orElseThrow(() -> new IllegalStateException("Sun sign seed data is missing"));
		return new RegistrationPreviewResponseDto(
				sunSign.getName(),
				sunSign.getType(),
				proposedFaction(sunSign.getType()),
				new RegistrationPreviewResponseDto.WelcomeCounts(WELCOME_CREDITS, 7, 1));
	}

	@Override
	@Transactional(readOnly = true)
	public NicknameAvailabilityResponseDto checkNicknameAvailability(String nickname) {
		String normalizedNickname = nickname == null ? "" : nickname.trim().toLowerCase(Locale.ROOT);
		if (!NICKNAME_PATTERN.matcher(normalizedNickname).matches()) {
			return new NicknameAvailabilityResponseDto(false, "INVALID_FORMAT");
		}
		if (playerRepo.existsByNickNameIgnoreCase(normalizedNickname)) {
			return new NicknameAvailabilityResponseDto(false, "TAKEN");
		}
		return new NicknameAvailabilityResponseDto(true, null);
	}

	private void requirePastBirthDate(LocalDate birthDate) {
		if (birthDate == null || !birthDate.isBefore(LocalDate.now())) {
			throw new IllegalArgumentException("Birth date must be in the past");
		}
	}

	private God proposedFaction(SignType signType) {
		return switch (signType) {
			case FIRE -> God.EFESTO;
			case WATER -> God.POSEIDONE;
			case EARTH -> God.DEMETRA;
			case AIR -> God.ERA;
		};
	}

	private List<StarterCard> selectStarterCards(List<Planet> planets, Planet sun, Sign sunSign) {
		List<Sign> signs = signRepo.findAll();
		Map<SignType, Integer> counts = new EnumMap<>(SignType.class);
		for (SignType type : SignType.values()) {
			counts.put(type, 0);
		}
		counts.put(sunSign.getType(), 1);

		List<Planet> remainingPlanets = new ArrayList<>(planets);
		remainingPlanets.remove(sun);
		java.util.Collections.shuffle(remainingPlanets);

		List<StarterCard> selected = new ArrayList<>(7);
		selected.add(new StarterCard(sun, sunSign));
		for (int index = 0; index < remainingPlanets.size(); index++) {
			int picksAfterThis = remainingPlanets.size() - index - 1;
			List<Sign> eligibleSigns = signs.stream()
					.filter(sign -> counts.get(sign.getType()) < 3)
					.filter(sign -> canCompleteElementDistribution(counts, sign.getType(), picksAfterThis))
					.toList();
			if (eligibleSigns.isEmpty()) {
				throw new IllegalStateException("Unable to create a valid starter element distribution");
			}

			Sign sign = eligibleSigns.get(ThreadLocalRandom.current().nextInt(eligibleSigns.size()));
			counts.compute(sign.getType(), (type, count) -> count + 1);
			selected.add(new StarterCard(remainingPlanets.get(index), sign));
		}
		return selected;
	}

	private boolean canCompleteElementDistribution(
			Map<SignType, Integer> counts,
			SignType selectedType,
			int picksRemaining) {
		int missingElements = 0;
		int remainingCapacity = 0;
		for (SignType type : SignType.values()) {
			int count = counts.get(type) + (type == selectedType ? 1 : 0);
			if (count == 0) {
				missingElements++;
			}
			remainingCapacity += 3 - count;
		}
		return missingElements <= picksRemaining && picksRemaining <= remainingCapacity;
	}

	private record StarterCard(Planet planet, Sign sign) {
	}
}