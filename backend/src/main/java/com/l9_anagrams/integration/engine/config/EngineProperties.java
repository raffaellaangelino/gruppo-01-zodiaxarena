package com.l9_anagrams.integration.engine.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "engine")
public record EngineProperties(
		String baseUrl,
		String apiKey,
		Duration connectTimeout,
		Duration readTimeout) {
}