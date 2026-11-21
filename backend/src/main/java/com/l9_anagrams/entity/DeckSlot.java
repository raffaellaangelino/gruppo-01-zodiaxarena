package com.l9_anagrams.entity;

import java.util.List;

/**
 * Le 8 posizioni fisse di un mazzo (Regolamento v2, V2-V4).
 * I nomi coincidono con le chiavi JSON del contratto (§5), così Jackson converte
 * "SOLE" in DeckSlot.SOLE senza configurazione.
 */
public enum DeckSlot {
    SOLE, LUNA, MARTE, GIOVE, SATURNO, MERCURIO, VENERE,
    ASCENDANT;

    /** I 7 slot delle creature, nell'ordine del regolamento. */
    public static final List<DeckSlot> PLANET_SLOTS =
            List.of(SOLE, LUNA, MARTE, GIOVE, SATURNO, MERCURIO, VENERE);

    public boolean isPlanet() {
        return this != ASCENDANT;
    }
}
