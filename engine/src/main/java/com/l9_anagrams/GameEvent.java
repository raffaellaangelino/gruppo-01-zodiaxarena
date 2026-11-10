package com.l9_anagrams;

import java.util.List;

public sealed interface GameEvent {
	record Draw(Side side, CardRef card) implements GameEvent {
	}

	record StatsResolved(Side side, CardRef card,
			List<Modifier> atk, int finalAtk,
			List<Modifier> def, int finalDef) implements GameEvent {
	}

	record DiceRoll(Side side, CardRef card, String purpose, // "AIR_ATK", "AIR_DEF", "HOUSE_V"
			String dice, int[] rolls, int result) implements GameEvent {
	}

	record AbilityTriggered(Side side, CardRef card, String source, // "HOUSE_II", "GOD_EFESTO"
			String description) implements GameEvent {
	}

	record Clash(Side side, int atk, int dmgDealt, int targetDefBefore, int targetDefAfter,
			List<Modifier> atkBreakdown) implements GameEvent {
	}

	record CreatureDied(Side side, CardRef card, int overkill) implements GameEvent {
	}

	record PlayerDamaged(Side side, int amount, int reducedBy, int hpBefore, int hpAfter) implements GameEvent {
	}

	record DeckExhausted(Side side) implements GameEvent {
	}
}
