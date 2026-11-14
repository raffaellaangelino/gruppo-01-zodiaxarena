package com.l9_anagrams.game.engine;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.l9_anagrams.game.domain.Ascendant;
import com.l9_anagrams.game.domain.Card;
import com.l9_anagrams.game.domain.Element;
import com.l9_anagrams.game.domain.God;
import com.l9_anagrams.game.domain.House;
import com.l9_anagrams.game.domain.Planet;
import com.l9_anagrams.game.domain.Player;
import com.l9_anagrams.game.domain.Sign;
import com.l9_anagrams.game.exception.DeckOwner;
import com.l9_anagrams.game.exception.GlobalExceptionHandler;
import com.l9_anagrams.game.exception.IllegalDeckException;
import com.l9_anagrams.game.model.GameInput;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import tools.jackson.databind.json.JsonMapper;

class GameValidationTest {
	private static final List<String> PLANETS = List.of(
			"Sole", "Marte", "Luna", "Giove", "Saturno", "Mercurio", "Venere");

	@Test
	void acceptsZeroOrOneAscendantWithAValidDeck() {
		assertDoesNotThrow(() -> new Game(input(new Player(God.ERA, Optional.empty(), validCards()))).play());
		assertDoesNotThrow(() -> new Game(input(new Player(God.ERA, null, validCards()))).play());
		assertDoesNotThrow(() -> new Game(input(new Player(God.ERA,
				Optional.of(new Ascendant(sign("Leone", Element.FUOCO))), validCards()))).play());
	}

	@Test
	void missingOptionalFieldsInJsonBecomeEmpty() throws Exception {
		String json = """
				{"player1":{"god":"ERA","cards":[]},"player2":{"god":"ERA","cards":[]}}
				""";

		GameInput input = JsonMapper.builder().build().readValue(json, GameInput.class);

		assertTrue(input.seed().isEmpty());
		assertTrue(input.player1().ascendant().isEmpty());
		assertTrue(input.player2().ascendant().isEmpty());
	}

	@Test
	void rejectsDecksThatDoNotContainExactlySevenCards() {
		List<Card> cards = validCards();
		IllegalDeckException error = assertInvalid(
				new Player(God.ERA, Optional.empty(), cards.subList(0, 6)));

		assertTrue(error.getMessage().contains("exactly 7 cards"));
		assertEquals(DeckOwner.PLAYER1, error.deckOwner());
	}

	@Test
	void rejectsMissingOrRepeatedPlanet() {
		List<Card> cards = new ArrayList<>(validCards());
		cards.set(6, new Card(cards.get(6).sign(), cards.get(0).planet(), House.I));
		IllegalDeckException error = assertInvalid(new Player(God.ERA, Optional.empty(), cards));

		assertTrue(error.getMessage().contains("exactly one card for planet"));
	}

	@Test
	void requiresAtLeastOneCardForEveryElement() {
		List<Card> cards = cardsForElements(Element.FUOCO, Element.FUOCO, Element.FUOCO,
				Element.TERRA, Element.TERRA, Element.ACQUA, Element.ACQUA);
		IllegalDeckException error = assertInvalid(new Player(God.ERA, Optional.empty(), cards));

		assertTrue(error.getMessage().contains("at least 1 card for element ARIA"));
	}

	@Test
	void rejectsMoreThanThreeCardsForAnElement() {
		List<Card> cards = cardsForElements(Element.FUOCO, Element.FUOCO, Element.FUOCO, Element.FUOCO,
				Element.TERRA, Element.ACQUA, Element.ARIA);
		IllegalDeckException error = assertInvalid(new Player(God.ERA, Optional.empty(), cards));

		assertTrue(error.getMessage().contains("at most 3 cards for element FUOCO"));
	}

	private static IllegalDeckException assertInvalid(Player player) {
		return assertThrows(IllegalDeckException.class,
				() -> new Game(input(player)).play());
	}

	@Test
	void identifiesPlayerTwoWhenItsDeckIsInvalid() {
		Player validPlayer = new Player(God.ERA, Optional.empty(), validCards());
		Player invalidPlayer = new Player(God.ERA, Optional.empty(), validCards().subList(0, 6));
		GameInput input = new GameInput(validPlayer, invalidPlayer, Optional.of(1L));

		IllegalDeckException error = assertThrows(IllegalDeckException.class, () -> new Game(input).play());

		assertEquals(DeckOwner.PLAYER2, error.deckOwner());
	}

	@Test
	void adviceReturnsBadRequestAndDeckOwner() {
		IllegalDeckException exception = new IllegalDeckException(DeckOwner.PLAYER2, "PLAYER2 has an invalid deck");

		var response = new GlobalExceptionHandler().handleIllegalDeck(exception);

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertEquals(DeckOwner.PLAYER2, response.getBody().player());
		assertEquals(exception.getMessage(), response.getBody().message());
	}

	private static GameInput input(Player playerA) {
		return new GameInput(playerA, new Player(God.ERA, Optional.empty(), validCards()), Optional.of(1L));
	}

	private static List<Card> validCards() {
		return cardsForElements(Element.ACQUA, Element.ACQUA, Element.FUOCO, Element.FUOCO,
				Element.TERRA, Element.TERRA, Element.ARIA);
	}

	private static List<Card> cardsForElements(Element... elements) {
		List<Card> cards = new ArrayList<>();
		for (int index = 0; index < PLANETS.size(); index++) {
			cards.add(new Card(sign("Segno " + index, elements[index]),
					new Planet(PLANETS.get(index), 0, 0), House.I));
		}
		return cards;
	}

	private static Sign sign(String name, Element element) {
		return new Sign(name, element, 10, 10);
	}
}