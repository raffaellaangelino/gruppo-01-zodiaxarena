package com.l9_anagrams.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@ConfigurationProperties(prefix = "zodiax.jwt")
@Validated
public record JwtProperties(
		@NotBlank String secretKey,
		@Positive long expirationMs) {
}
