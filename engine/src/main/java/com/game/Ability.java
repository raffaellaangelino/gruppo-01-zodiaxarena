package com.game;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public interface Ability {
	default void onMatchStart(MatchStartContext event) {
	}

	default void onEnteredPlay(EnteredPlayContext event) {
	}

	default void onRoundStart(RoundStartContext event) {
	}

	default void onPvDamage(PvDamageContext event) {
	}

	default void onAttacking(AttackContext event) {
	}

	default void onDamageTaken(DamageTakenContext event) {
	}

	default void onCardDefeated(CardDefeatedContext event) {
	}

	record MatchStartContext(GameInput input, long seed) {
	}

	final class EnteredPlayContext {
		private final PlayerSide side;
		private final Player player;
		private final Card card;
		private final int baseAttack;
		private final int baseDefense;
		private int attack;
		private int defense;
		private final List<Contribution> attackBonuses = new ArrayList<>();
		private final List<Contribution> defenseBonuses = new ArrayList<>();

		public EnteredPlayContext(PlayerSide side, Player player, Card card, int baseAttack, int baseDefense) {
			this.side = Objects.requireNonNull(side);
			this.player = Objects.requireNonNull(player);
			this.card = Objects.requireNonNull(card);
			this.baseAttack = baseAttack;
			this.baseDefense = baseDefense;
			this.attack = baseAttack;
			this.defense = baseDefense;
		}

		public PlayerSide side() {
			return side;
		}

		public Player player() {
			return player;
		}

		public Card card() {
			return card;
		}

		public int baseAttack() {
			return baseAttack;
		}

		public int baseDefense() {
			return baseDefense;
		}

		public int attack() {
			return attack;
		}

		public int defense() {
			return defense;
		}

		public List<Contribution> attackBonuses() {
			return List.copyOf(attackBonuses);
		}

		public List<Contribution> defenseBonuses() {
			return List.copyOf(defenseBonuses);
		}

		public void addAttack(int amount, String source) {
			attack += amount;
			attackBonuses.add(new Contribution(amount, source));
		}

		public void addDefense(int amount, String source) {
			defense += amount;
			defenseBonuses.add(new Contribution(amount, source));
		}
	}

	final class RoundStartContext {
		private final int round;
		private final int playerAPv;
		private final int playerBPv;
		private final Card playerACard;
		private final Card playerBCard;

		public RoundStartContext(int round, int playerAPv, int playerBPv, Card playerACard, Card playerBCard) {
			this.round = round;
			this.playerAPv = playerAPv;
			this.playerBPv = playerBPv;
			this.playerACard = playerACard;
			this.playerBCard = playerBCard;
		}

		public int round() {
			return round;
		}

		public int playerAPv() {
			return playerAPv;
		}

		public int playerBPv() {
			return playerBPv;
		}

		public Card playerACard() {
			return playerACard;
		}

		public Card playerBCard() {
			return playerBCard;
		}
	}

	final class AttackContext {
		private final PlayerSide attackerSide;
		private final Player attackerPlayer;
		private final Card attacker;
		private final Card defender;
		private final int round;
		private final int attackerPv;
		private final int defenderPv;
		private final List<Contribution> contributions = new ArrayList<>();

		public AttackContext(PlayerSide attackerSide, Player attackerPlayer, Card attacker, Card defender,
				int round,
				int attackerPv, int defenderPv) {
			this.attackerSide = attackerSide;
			this.attackerPlayer = attackerPlayer;
			this.attacker = attacker;
			this.defender = defender;
			this.round = round;
			this.attackerPv = attackerPv;
			this.defenderPv = defenderPv;
		}

		public PlayerSide attackerSide() {
			return attackerSide;
		}

		public Player attackerPlayer() {
			return attackerPlayer;
		}

		public Card attacker() {
			return attacker;
		}

		public Card defender() {
			return defender;
		}

		public int round() {
			return round;
		}

		public int attackerPv() {
			return attackerPv;
		}

		public int defenderPv() {
			return defenderPv;
		}

		public List<Contribution> contributions() {
			return List.copyOf(contributions);
		}

		public int total() {
			int total = 0;
			for (Contribution contribution : contributions) {
				total += contribution.amount();
			}
			return Math.max(0, total);
		}

		public void add(int amount, String source) {
			contributions.add(new Contribution(amount, source));
		}
	}

	final class DamageTakenContext {
		private final PlayerSide side;
		private final Card card;
		private final int requestedDamage;
		private int damage;
		private final List<Contribution> reductions = new ArrayList<>();

		public DamageTakenContext(PlayerSide side, Card card, int requestedDamage) {
			this.side = side;
			this.card = card;
			this.requestedDamage = requestedDamage;
			this.damage = requestedDamage;
		}

		public PlayerSide side() {
			return side;
		}

		public Card card() {
			return card;
		}

		public int requestedDamage() {
			return requestedDamage;
		}

		public int damage() {
			return Math.max(0, damage);
		}

		public List<Contribution> reductions() {
			return List.copyOf(reductions);
		}

		public void reduceDamage(int amount, String source) {
			int reduction = Math.min(Math.max(0, amount), Math.max(0, damage));
			damage -= reduction;
			reductions.add(new Contribution(-reduction, source));
		}
	}

	final class PvDamageContext {
		private final PlayerSide side;
		private final Card defeatedCard;
		private final int excessDamage;
		private int damage;
		private final List<Contribution> reductions = new ArrayList<>();

		public PvDamageContext(PlayerSide side, Card defeatedCard, int excessDamage) {
			this.side = side;
			this.defeatedCard = defeatedCard;
			this.excessDamage = Math.max(0, excessDamage);
			this.damage = this.excessDamage;
		}

		public PlayerSide side() {
			return side;
		}

		public Card defeatedCard() {
			return defeatedCard;
		}

		public int excessDamage() {
			return excessDamage;
		}

		public int damage() {
			return Math.max(0, damage);
		}

		public List<Contribution> reductions() {
			return List.copyOf(reductions);
		}

		public void reduceDamage(int amount, String source) {
			int reduction = Math.min(Math.max(0, amount), Math.max(0, damage));
			damage -= reduction;
			reductions.add(new Contribution(-reduction, source));
		}
	}

	record CardDefeatedContext(PlayerSide side, Card card, boolean mutualDeath, int round) {
	}

	record Contribution(int amount, String source) {
	}
}