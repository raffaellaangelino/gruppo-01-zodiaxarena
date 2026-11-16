package com.l9_anagrams.game.engine;

import com.l9_anagrams.game.domain.Element;
import com.l9_anagrams.game.domain.God;
import com.l9_anagrams.game.domain.House;

final class RuleAbilities {
	private RuleAbilities() {
	}

	static final class ElementAbility implements Ability {
		@Override
		public void onEnteredPlay(EnteredPlayContext event) {
			if (event.card().sign().element() == Element.ACQUA) {
				event.addDefense(1, "Acqua");
			}
		}

		@Override
		public void onAttacking(AttackContext event) {
			Element attacker = event.attacker().sign().element();
			if (attacker == Element.FUOCO) {
				event.add(1, "Fuoco");
			}
			if (attacker.beats(event.defender().sign().element())) {
				event.add(1, "vantaggio elemento");
			}
		}
	}

	static final class GodAbility implements Ability {
		@Override
		public void onEnteredPlay(EnteredPlayContext event) {
			if (event.player().god().element() != event.card().sign().element()) {
				return;
			}
			switch (event.player().god()) {
				case POSEIDONE -> event.addDefense(3, "Poseidone");
				case DEMETRA, ERA -> event.addDefense(1, event.player().god().name());
				default -> {
				}
			}
		}

		@Override
		public void onAttacking(AttackContext event) {
			God god = event.attackerPlayer().god();
			if (god.element() != event.attacker().sign().element()) {
				return;
			}
			switch (god) {
				case EFESTO -> event.add(2, "Efesto");
				case DEMETRA, ERA -> event.add(1, god.name());
				default -> {
				}
			}
		}
	}

	static final class AscendantAbility implements Ability {
		@Override
		public void onAttacking(AttackContext event) {
			event.attackerPlayer().ascendant()
					.filter(ascendant -> event.attacker().sign().name()
							.equalsIgnoreCase(ascendant.sign().name()))
					.ifPresent(ascendant -> event.add(1, "Ascendente"));
		}
	}

	static final class HouseOneAbility implements Ability {
		@Override
		public void onEnteredPlay(EnteredPlayContext event) {
			if (event.card().house() == House.I) {
				event.addDefense(2, "Casa I");
			}
		}
	}

	static final class EarthDamageAbility implements Ability {
		@Override
		public void onPvDamage(PvDamageContext event) {
			if (event.defeatedCard().sign().element() == Element.TERRA) {
				event.reduceDamage(1, "Terra");
			}
		}
	}
}