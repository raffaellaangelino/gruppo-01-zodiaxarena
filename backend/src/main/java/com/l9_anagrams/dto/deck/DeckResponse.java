package com.l9_anagrams.dto.deck;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.l9_anagrams.entity.DeckSlot;
import com.l9_anagrams.entity.SignType;

/** Risposta di lettura e salvataggio di un mazzo (contratto §5.1, più id e updatedAt). */
public record DeckResponse(
        Long id,
        String name,
        Instant updatedAt,
        @JsonInclude(content = JsonInclude.Include.ALWAYS)
        Map<DeckSlot, Long> slots,                 // sempre 8 chiavi, null se vuoto
        boolean valid,
        List<DeckProblem> problems,
        Map<SignType, Integer> elementBalance,     // FIRE, WATER, EARTH, AIR
        Map<Long, EffectiveStats> effectiveStats   // chiave = id della carta
) {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record DeckProblem(String rule, String code, SignType element) {
        public static DeckProblem of(String rule, String code) {
            return new DeckProblem(rule, code, null);
        }
    }

    public record EffectiveStats(List<StatContribution> atk, List<StatContribution> def) {
    }

    public record StatContribution(StatSource source, int delta) {
    }

    public enum StatSource {
        SIGN_BASE, AIR_ROLL, PLANET, ELEMENT, ADVANTAGE, ASCENDANT, GOD, HOUSE_I
    }
}
