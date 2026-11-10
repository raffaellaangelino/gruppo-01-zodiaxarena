package com.l9_anagrams;

import java.util.List;

public record RoundLog(int round, List<GameEvent> events) {
}