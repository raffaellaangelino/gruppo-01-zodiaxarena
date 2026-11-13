package com.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

class GameTest {
	@Test
	void matchIsDeterministicAndLogsTerraDamageReduction() {
		GameInput input = new GameInput(
				player(God.ERA, sign("Cancro", Element.ACQUA, 10, 10),
						card("Cancro", Element.ACQUA, 10, 10)),
				player(God.EFESTO, sign("Toro", Element.TERRA, 1, 3),
						card("Toro", Element.TERRA, 1, 3)),
				42L);

		GameResult result = new Game(input).play();

		assertEquals(result, new Game(input).play());
		assertEquals(GameOutcome.PLAYER_A_WINS, result.outcome());
		assertEquals(EndReason.DECKS_EXHAUSTED, result.reason());
		assertEquals(5, result.playerBPv());
		GameEvent pvDamage = result.log().stream()
				.filter(event -> event.type().equals("pv_damage"))
				.findFirst()
				.orElseThrow();
		assertEquals(6, pvDamage.details().get("excess"));
		assertEquals(5, pvDamage.details().get("applied"));
	}

	@Test
	void dispatchesEveryDeclaredMatchAbilityEvent() {
		GameInput input = new GameInput(
				player(God.ERA, sign("Cancro", Element.ACQUA, 10, 10),
						card("Cancro", Element.ACQUA, 10, 10)),
				player(God.EFESTO, sign("Toro", Element.TERRA, 1, 3),
						card("Toro", Element.TERRA, 1, 3)),
				7L);
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
		assertEquals(2, events.stream().filter(event -> event.equals("attack")).count());
		assertEquals(2, events.stream().filter(event -> event.equals("damage")).count());
	}

	@Test
	void airStatsAreRolledAsEvenValuesAndLogged() {
		GameInput input = new GameInput(
				player(God.ERA, sign("Gemelli", Element.ARIA, 10, 10),
						card("Gemelli", Element.ARIA, 10, 10)),
				player(God.EFESTO, sign("Bilancia", Element.ARIA, 10, 10),
						card("Bilancia", Element.ARIA, 10, 10)),
				19L);

		GameResult result = new Game(input).play();

		List<GameEvent> entries = result.log().stream()
				.filter(event -> event.type().equals("card_entered_play"))
				.toList();
		assertEquals(2, entries.size());
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
		return new Player(god, new Ascendant(ascendant), List.of(card));
	}

	private static Sign sign(String name, Element element, int attack, int defense) {
		return new Sign(name, element, attack, defense);
	}

	private static Card card(String name, Element element, int attack, int defense) {
		return new Card(sign(name, element, attack, defense), new Planet("Test", 0, 0), House.I);
	}
}