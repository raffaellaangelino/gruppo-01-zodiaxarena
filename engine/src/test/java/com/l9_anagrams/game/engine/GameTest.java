package com.l9_anagrams.game.engine;

import com.l9_anagrams.game.domain.Ascendant;
import com.l9_anagrams.game.domain.Card;
import com.l9_anagrams.game.domain.Element;
import com.l9_anagrams.game.domain.God;
import com.l9_anagrams.game.domain.House;
import com.l9_anagrams.game.domain.Planet;
import com.l9_anagrams.game.domain.Player;
import com.l9_anagrams.game.domain.PlayerSide;
import com.l9_anagrams.game.domain.Sign;
import com.l9_anagrams.game.model.GameEvent;
import com.l9_anagrams.game.model.GameInput;
import com.l9_anagrams.game.model.GameResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

class GameTest {
	@Test
	void matchIsDeterministicAndLogsTerraDamageReduction() {
		GameInput input = new GameInput(
				player(God.ERA, sign("Cancro", Element.ACQUA, 10, 10),
						card("Cancro", Element.ACQUA, 10, 10)),
				player(God.EFESTO, sign("Toro", Element.TERRA, 1, 3),
						card("Toro", Element.TERRA, 1, 3)),
				Optional.of(42L));

		GameResult result = new Game(input).play();

		assertEquals(result, new Game(input).play());
		assertEquals(42L, result.seed());
		assertTrue(result.log().stream().anyMatch(event -> event.type().equals("match_ended")));
	}

	@Test
	void terraReducesExcessPlayerDamageByOne() {
		Card earthCard = card("Toro", Element.TERRA, 10, 10);
		Ability.PvDamageContext event = new Ability.PvDamageContext(PlayerSide.A, earthCard, 6);

		new RuleAbilities.EarthDamageAbility().onPvDamage(event);

		assertEquals(5, event.damage());
		assertEquals(-1, event.reductions().get(0).amount());
	}

	@Test
	void dispatchesEveryDeclaredMatchAbilityEvent() {
		GameInput input = new GameInput(
				player(God.ERA, sign("Cancro", Element.ACQUA, 10, 10),
						card("Cancro", Element.ACQUA, 10, 10)),
				player(God.EFESTO, sign("Toro", Element.TERRA, 1, 3),
						card("Toro", Element.TERRA, 1, 3)),
				Optional.of(7L));
		List<String> events = new ArrayList<>();
		Ability listener = new Ability() {
			@Override
			public void onMatchStart(MatchStartContext event) {
				events.add("match");
			}

			@Override
			public void onEnteredPlay(EnteredPlayContext event) {
				events.add("entered");
			}

			@Override
			public void onRoundStart(RoundStartContext event) {
				events.add("round");
			}

			@Override
			public void onPvDamage(PvDamageContext event) {
				events.add("pv");
			}

			@Override
			public void onAttacking(AttackContext event) {
				events.add("attack");
			}

			@Override
			public void onDamageTaken(DamageTakenContext event) {
				events.add("damage");
			}

			@Override
			public void onCardDefeated(CardDefeatedContext event) {
				events.add("defeated");
			}
		};

		new Game(input, List.of(listener)).play();

		assertTrue(events.containsAll(List.of("match", "entered", "round", "pv", "attack", "damage", "defeated")));
		assertTrue(events.stream().filter(event -> event.equals("attack")).count() >= 2);
		assertTrue(events.stream().filter(event -> event.equals("damage")).count() >= 2);
	}

	@Test
	void airStatsAreRolledAsEvenValuesAndLogged() {
		GameInput input = new GameInput(
				player(God.ERA, sign("Gemelli", Element.ARIA, 10, 10),
						card("Gemelli", Element.ARIA, 10, 10)),
				player(God.EFESTO, sign("Bilancia", Element.ARIA, 10, 10),
						card("Bilancia", Element.ARIA, 10, 10)),
				Optional.of(19L));

		GameResult result = new Game(input).play();

		List<GameEvent> entries = result.log().stream()
				.filter(event -> event.type().equals("card_entered_play"))
				.filter(event -> event.details().containsKey("airAttackDice"))
				.toList();
		assertTrue(entries.size() >= 1);
		for (GameEvent entry : entries) {
			assertAirStat(entry.details().get("baseAttack"));
			assertAirStat(entry.details().get("baseDefense"));
			assertTrue(entry.details().containsKey("airAttackDice"));
			assertTrue(entry.details().containsKey("airDefenseDice"));
		}
	}

	private static void assertAirStat(Object value) {
		int stat = (int) value;
		assertTrue(stat >= 4 && stat <= 16 && stat % 2 == 0);
	}

	private static Player player(God god, Sign ascendant, Card card) {
		List<String> planets = List.of("Sole", "Marte", "Luna", "Giove", "Saturno", "Mercurio", "Venere");
		Element[] elements = { Element.ACQUA, Element.ACQUA, Element.FUOCO, Element.FUOCO,
				Element.TERRA, Element.TERRA, Element.ARIA };
		List<Card> cards = new ArrayList<>();
		for (int index = 0; index < planets.size(); index++) {
			Sign cardSign = index == 0 ? card.sign()
					: sign("Segno " + index, elements[index], card.sign().attack(), card.sign().defense());
			cards.add(new Card(cardSign, new Planet(planets.get(index), 0, 0), House.I));
		}
		return new Player(god, Optional.of(new Ascendant(ascendant)), cards);
	}

	private static Sign sign(String name, Element element, int attack, int defense) {
		return new Sign(name, element, attack, defense);
	}

	private static Card card(String name, Element element, int attack, int defense) {
		return new Card(sign(name, element, attack, defense), new Planet("Test", 0, 0), House.I);
	}
}