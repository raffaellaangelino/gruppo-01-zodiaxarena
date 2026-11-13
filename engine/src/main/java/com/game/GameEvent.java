package com.game;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

public record GameEvent(String type, int round, PlayerSide player, String card, Map<String, Object> details) {
	public GameEvent {
		details = Collections.unmodifiableMap(new LinkedHashMap<>(details));
	}
}