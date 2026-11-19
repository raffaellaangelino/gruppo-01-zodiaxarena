package com.l9_anagrams.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Service
public class ChallengeSseRegistry {
	private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

	public SseEmitter subscribe(Long playerId) {
		SseEmitter emitter = new SseEmitter(0L);
		emitters.computeIfAbsent(playerId, ignored -> new CopyOnWriteArrayList<>()).add(emitter);
		emitter.onCompletion(() -> remove(playerId, emitter));
		emitter.onTimeout(() -> remove(playerId, emitter));
		emitter.onError(ignored -> remove(playerId, emitter));
		return emitter;
	}

	public void send(Long playerId, String eventName, Object payload) {
		List<SseEmitter> subscribers = emitters.get(playerId);
		if (subscribers == null) {
			return;
		}
		for (SseEmitter emitter : subscribers) {
			try {
				emitter.send(SseEmitter.event().name(eventName).data(payload));
			} catch (IOException | IllegalStateException exception) {
				remove(playerId, emitter);
			}
		}
	}

	private void remove(Long playerId, SseEmitter emitter) {
		List<SseEmitter> subscribers = emitters.get(playerId);
		if (subscribers == null) {
			return;
		}
		subscribers.remove(emitter);
		if (subscribers.isEmpty()) {
			emitters.remove(playerId, subscribers);
		}
	}
}
