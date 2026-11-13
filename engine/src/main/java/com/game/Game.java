package com.game;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;

public class Game {
	private static final int STARTING_PV = 10;
	private static final int ROUND_LIMIT = 30;

	private final GameInput input;
	private final long seed;
	private final AbilityDispatcher abilities;
	private final List<GameEvent> log = new ArrayList<>();

	public Game(GameInput input) {
		this(input, List.of());
	}

	public Game(GameInput input, List<Ability> additionalAbilities) {
		this.input = Objects.requireNonNull(input, "Game input is required");
		this.seed = input.seed() == null ? new SecureRandom().nextLong() : input.seed();
		this.abilities = new AbilityDispatcher()
				.register(new RuleAbilities.ElementAbility())
				.register(new RuleAbilities.GodAbility())
				.register(new RuleAbilities.AscendantAbility())
				.register(new RuleAbilities.HouseOneAbility())
				.register(new RuleAbilities.EarthDamageAbility());
		additionalAbilities.forEach(abilities::register);
	}

	public GameResult play() {
		validate();
		log.clear();
		Random random = new Random(seed);
		MatchPlayer playerA = new MatchPlayer(PlayerSide.A, input.player1());
		MatchPlayer playerB = new MatchPlayer(PlayerSide.B, input.player2());

		addEvent("match_started", 0, null, null, "seed", seed);
		abilities.onMatchStart(new Ability.MatchStartContext(input, seed));
		Collections.shuffle(playerA.deck, random);
		Collections.shuffle(playerB.deck, random);
		addEvent("deck_shuffled", 0, PlayerSide.A, null, "cards", labels(playerA.deck));
		addEvent("deck_shuffled", 0, PlayerSide.B, null, "cards", labels(playerB.deck));

		int roundsPlayed = 0;
		while (roundsPlayed < ROUND_LIMIT) {
			if (playerA.active == null) {
				draw(playerA, random, roundsPlayed + 1);
			}
			if (playerB.active == null) {
				draw(playerB, random, roundsPlayed + 1);
			}
			if (playerA.active == null || playerB.active == null) {
				return finishByTiebreak(playerA, playerB, roundsPlayed, EndReason.DECKS_EXHAUSTED);
			}

			int round = ++roundsPlayed;
			addEvent("round_started", round, null, null,
					"playerAPv", playerA.pv,
					"playerBPv", playerB.pv,
					"playerACard", playerA.active.card.label(),
					"playerBCard", playerB.active.card.label());
			abilities.onRoundStart(new Ability.RoundStartContext(round, playerA.pv, playerB.pv,
					playerA.active.card, playerB.active.card));

			Ability.AttackContext attackA = attack(playerA, playerB, round);
			Ability.AttackContext attackB = attack(playerB, playerA, round);
			int defenseBeforeA = playerA.active.defense;
			int defenseBeforeB = playerB.active.defense;
			takeDamage(playerA, attackB.total(), round);
			takeDamage(playerB, attackA.total(), round);

			boolean defeatedA = playerA.active.defense <= 0;
			boolean defeatedB = playerB.active.defense <= 0;
			if (defeatedA) {
				defeat(playerA, defeatedB, round);
			}
			if (defeatedB) {
				defeat(playerB, defeatedA, round);
			}

			if (defeatedA != defeatedB) {
				MatchPlayer loser = defeatedA ? playerA : playerB;
				int winningAttack = defeatedA ? attackB.total() : attackA.total();
				int losingDefense = defeatedA ? defenseBeforeA : defenseBeforeB;
				int excess = Math.max(0, winningAttack - losingDefense);
				Card defeatedCard = defeatedA ? playerA.lastDefeated : playerB.lastDefeated;
				Ability.PvDamageContext pvDamage = new Ability.PvDamageContext(loser.side, defeatedCard,
						excess);
				abilities.onPvDamage(pvDamage);
				int applied = Math.min(loser.pv, pvDamage.damage());
				loser.pv -= applied;
				addEvent("pv_damage", round, loser.side, defeatedCard.label(),
						"excess", excess,
						"reductions", pvDamage.reductions(),
						"applied", applied,
						"remainingPv", loser.pv);
			}

			if (playerA.pv == 0 || playerB.pv == 0) {
				GameOutcome outcome = playerA.pv == 0 && playerB.pv == 0
						? GameOutcome.DRAW
						: playerA.pv == 0 ? GameOutcome.PLAYER_B_WINS : GameOutcome.PLAYER_A_WINS;
				return finish(playerA, playerB, roundsPlayed, outcome, EndReason.KO, null);
			}

			if ((playerA.active == null && playerA.deck.isEmpty())
					|| (playerB.active == null && playerB.deck.isEmpty())) {
				return finishByTiebreak(playerA, playerB, roundsPlayed, EndReason.DECKS_EXHAUSTED);
			}
			if (roundsPlayed == ROUND_LIMIT) {
				return finishByTiebreak(playerA, playerB, roundsPlayed, EndReason.ROUND_LIMIT);
			}
		}
		throw new IllegalStateException("Match ended without a result");
	}

	private void validate() {
		for (Player player : List.of(input.player1(), input.player2())) {
			if (player.cards().stream().anyMatch(card -> card.house() != House.I)) {
				throw new IllegalArgumentException("Only Casa I abilities are implemented");
			}
		}
	}

	private void draw(MatchPlayer player, Random random, int round) {
		if (player.deck.isEmpty()) {
			return;
		}
		Card card = player.deck.remove(0);
		addEvent("card_drawn", round, player.side, card.label(), "cardsRemaining", player.deck.size());
		int baseAttack;
		int baseDefense;
		List<Integer> attackRoll = List.of();
		List<Integer> defenseRoll = List.of();
		if (card.sign().element() == Element.ARIA) {
			attackRoll = rollAirStat(random);
			defenseRoll = rollAirStat(random);
			baseAttack = (attackRoll.get(0) + attackRoll.get(1)) * 2;
			baseDefense = (defenseRoll.get(0) + defenseRoll.get(1)) * 2;
		} else {
			baseAttack = card.sign().attack();
			baseDefense = card.sign().defense();
		}

		Ability.EnteredPlayContext entered = new Ability.EnteredPlayContext(
				player.side, player.player, card, baseAttack, baseDefense);
		entered.addAttack(card.planet().attackBonus(), "planet " + card.planet().name());
		entered.addDefense(card.planet().defenseBonus(), "planet " + card.planet().name());
		abilities.onEnteredPlay(entered);
		player.active = new CreatureState(card, baseAttack, entered.defense(), entered);

		Map<String, Object> details = new LinkedHashMap<>();
		details.put("baseAttack", baseAttack);
		details.put("baseDefense", baseDefense);
		details.put("attackBonuses", entered.attackBonuses());
		details.put("defenseBonuses", entered.defenseBonuses());
		details.put("attack", entered.attack());
		details.put("defense", entered.defense());
		if (!attackRoll.isEmpty()) {
			details.put("airAttackDice", attackRoll);
			details.put("airDefenseDice", defenseRoll);
		}
		addEvent("card_entered_play", round, player.side, card.label(), details);
	}

	private List<Integer> rollAirStat(Random random) {
		return List.of(random.nextInt(1, 5), random.nextInt(1, 5));
	}

	private Ability.AttackContext attack(MatchPlayer attacker, MatchPlayer defender, int round) {
		CreatureState creature = attacker.active;
		Ability.AttackContext context = new Ability.AttackContext(attacker.side, attacker.player, creature.card,
				defender.active.card, round, attacker.pv, defender.pv);
		context.add(creature.baseAttack, "sign or Air roll");
		for (Ability.Contribution contribution : creature.entry.attackBonuses()) {
			context.add(contribution.amount(), contribution.source());
		}
		abilities.onAttacking(context);
		addEvent("attack", round, attacker.side, creature.card.label(),
				"defender", defender.active.card.label(),
				"contributions", context.contributions(),
				"total", context.total());
		return context;
	}

	private void takeDamage(MatchPlayer player, int requestedDamage, int round) {
		CreatureState creature = player.active;
		int before = creature.defense;
		Ability.DamageTakenContext context = new Ability.DamageTakenContext(player.side, creature.card,
				requestedDamage);
		abilities.onDamageTaken(context);
		creature.defense -= context.damage();
		addEvent("damage_taken", round, player.side, creature.card.label(),
				"requested", requestedDamage,
				"reductions", context.reductions(),
				"applied", context.damage(),
				"defenseBefore", before,
				"defenseAfter", creature.defense);
	}

	private void defeat(MatchPlayer player, boolean mutual, int round) {
		CreatureState defeated = player.active;
		player.lastDefeated = defeated.card;
		abilities.onCardDefeated(new Ability.CardDefeatedContext(player.side, defeated.card, mutual, round));
		addEvent("card_defeated", round, player.side, defeated.card.label(), "mutualDeath", mutual);
		player.active = null;
	}

	private GameResult finishByTiebreak(MatchPlayer playerA, MatchPlayer playerB, int roundsPlayed,
			EndReason reason) {
		String criterion;
		GameOutcome outcome;
		if (playerA.pv != playerB.pv) {
			criterion = "PV";
			outcome = playerA.pv > playerB.pv ? GameOutcome.PLAYER_A_WINS : GameOutcome.PLAYER_B_WINS;
		} else if (playerA.creaturesRemaining() != playerB.creaturesRemaining()) {
			criterion = "CREATURES_REMAINING";
			outcome = playerA.creaturesRemaining() > playerB.creaturesRemaining()
					? GameOutcome.PLAYER_A_WINS
					: GameOutcome.PLAYER_B_WINS;
		} else if (playerA.residualDefense() != playerB.residualDefense()) {
			criterion = "RESIDUAL_DEFENSE";
			outcome = playerA.residualDefense() > playerB.residualDefense()
					? GameOutcome.PLAYER_A_WINS
					: GameOutcome.PLAYER_B_WINS;
		} else {
			criterion = "DRAW";
			outcome = GameOutcome.DRAW;
		}
		return finish(playerA, playerB, roundsPlayed, outcome, reason, criterion);
	}

	private GameResult finish(MatchPlayer playerA, MatchPlayer playerB, int roundsPlayed, GameOutcome outcome,
			EndReason reason, String tieBreaker) {
		addEvent("match_ended", roundsPlayed, null, null,
				"outcome", outcome,
				"reason", reason,
				"tieBreaker", tieBreaker,
				"playerAPv", playerA.pv,
				"playerBPv", playerB.pv);
		return new GameResult(seed, outcome, reason, playerA.pv, playerB.pv, roundsPlayed,
				playerA.creaturesRemaining(), playerB.creaturesRemaining(), playerA.residualDefense(),
				playerB.residualDefense(), tieBreaker, log);
	}

	private List<String> labels(List<Card> cards) {
		List<String> labels = new ArrayList<>(cards.size());
		for (Card card : cards) {
			labels.add(card.label());
		}
		return List.copyOf(labels);
	}

	private void addEvent(String type, int round, PlayerSide player, String card, Object... values) {
		Map<String, Object> details = new LinkedHashMap<>();
		for (int index = 0; index < values.length; index += 2) {
			details.put((String) values[index], values[index + 1]);
		}
		addEvent(type, round, player, card, details);
	}

	private void addEvent(String type, int round, PlayerSide player, String card, Map<String, Object> details) {
		log.add(new GameEvent(type, round, player, card, details));
	}

	private static final class MatchPlayer {
		private final PlayerSide side;
		private final Player player;
		private final List<Card> deck;
		private int pv = STARTING_PV;
		private CreatureState active;
		private Card lastDefeated;

		private MatchPlayer(PlayerSide side, Player player) {
			this.side = side;
			this.player = player;
			this.deck = new ArrayList<>(player.cards());
		}

		private int creaturesRemaining() {
			return deck.size() + (active == null ? 0 : 1);
		}

		private int residualDefense() {
			return active == null ? 0 : Math.max(0, active.defense);
		}
	}

	private static final class CreatureState {
		private final Card card;
		private final int baseAttack;
		private final Ability.EnteredPlayContext entry;
		private int defense;

		private CreatureState(Card card, int baseAttack, int defense, Ability.EnteredPlayContext entry) {
			this.card = card;
			this.baseAttack = baseAttack;
			this.defense = defense;
			this.entry = entry;
		}
	}
}
