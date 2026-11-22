package com.l9_anagrams.config;

import java.security.SecureRandom;
import java.util.random.RandomGenerator;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RandomConfig {

	/** Sorteggio dei pacchetti: imprevedibile in produzione, sostituibile con un seme fisso nei test. */
	@Bean
	public RandomGenerator packRandom() {
		return new SecureRandom();
	}
}
