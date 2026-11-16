package com.l9_anagrams.game.engine;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public final class AbilityDispatcher {
	private final List<Ability> abilities = new ArrayList<>();

	public AbilityDispatcher register(Ability ability) {
		abilities.add(Objects.requireNonNull(ability));
		return this;
	}

	public void onMatchStart(Ability.MatchStartContext event) {
		abilities.forEach(ability -> ability.onMatchStart(event));
	}

	public void onEnteredPlay(Ability.EnteredPlayContext event) {
		abilities.forEach(ability -> ability.onEnteredPlay(event));
	}

	public void onRoundStart(Ability.RoundStartContext event) {
		abilities.forEach(ability -> ability.onRoundStart(event));
	}

	public void onPvDamage(Ability.PvDamageContext event) {
		abilities.forEach(ability -> ability.onPvDamage(event));
	}

	public void onAttacking(Ability.AttackContext event) {
		abilities.forEach(ability -> ability.onAttacking(event));
	}

	public void onDamageTaken(Ability.DamageTakenContext event) {
		abilities.forEach(ability -> ability.onDamageTaken(event));
	}

	public void onCardDefeated(Ability.CardDefeatedContext event) {
		abilities.forEach(ability -> ability.onCardDefeated(event));
	}
}