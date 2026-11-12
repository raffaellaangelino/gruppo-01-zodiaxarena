package com.l9_anagrams;

import java.util.List;

public class Game {

	private long seed;
	private Object player1;
	private Object player2;

	public void play() {
		validate();
		shuffleDecks();

	}

	private void validate() {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'validate'");
	}

	private void shuffleDecks() {
		// TODO Auto-generated method stub
		throw new UnsupportedOperationException("Unimplemented method 'shuffleDecks'");
	}

	public class PlayerSetup {
		private God god;
		private Ascendant ascendant;
		private List<Card> cards;
	}

	public class Card {
		private Sign sign;
		private Planet planet;
		private House house;
	}

	public class Sign {
		private Element element;
		private int atk;
		private int def;
	}

	public class Planet {
		private int atkBonus;
		private int defBonus;
	}

	public enum God {
		EFESTO,
		POSEIDONE,
		DEMETRA,
		ERA,
		// ADE
	}

	public enum House {
		I
	}

	public enum Element {
		ACQUA,
		FUOCO,
		TERRA,
		ARIA
	}

	// validate that both PlayerSetups are legal
	// else throw exception

	// initial setup
	// shuffle decks
	// god / ascendant bonus

	// turn
	// pick cards

	/*
	 * NUOVO REGOLAMENTO
	 * 
	 * bonus elemento: +1 ATK contro elemento debole
	 * abilità elemento:
	 * - FUOCO +1 ATK
	 * - ACQUA +1 DEF
	 * - TERRA -1 PVdmg
	 * - ARIA 2d4*2 ATK e DEF
	 * 
	 * bonus ascendente: +1 ATK stesso segno
	 * bonus dio:
	 * - EFESTO +2 ATK carte fuoco
	 * - POSEIDONE +3 DEF carte acqua
	 * - DEMETRA +1 ATK/DEF carte terra
	 * - ERA +1 ATK/DEF carte aria
	 * - ADE +1 PV per carta nemica sconfitta (non implementare)
	 * 
	 * carta composta da:
	 * - segno -> ATK, DEF e elemento/fazione
	 * - pianeta -> bonus ATK e DEF
	 * - casa -> +2 DEF (nuova casa ogni 3 mesi)
	 */

}
