package com.l9_anagrams;

import java.util.Map;

public record Outcome(Winner winner, EndReason reason, Tiebreak decidedBy, Map<Side, Integer> hp,
		Map<Side, Integer> creaturesLeft, Map<Side, Integer> survivorDef) {
}
