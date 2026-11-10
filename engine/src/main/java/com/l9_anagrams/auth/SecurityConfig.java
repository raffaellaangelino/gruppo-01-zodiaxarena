package com.l9_anagrams.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Value("${security.api-key:}")
	private String apiKey;

	private static final String[] PUBLIC_ENDPOINTS = {
			"/actuator/health",
	};

	@Bean
	@ConditionalOnProperty(name = "security.enabled", havingValue = "true", matchIfMissing = true)
	public SecurityFilterChain enabledSecurityFilterChain(HttpSecurity http) {
		return http
				.csrf(ahc -> ahc.disable())
				.authorizeHttpRequests(authReg -> authReg
						.requestMatchers(PUBLIC_ENDPOINTS).permitAll()
						.anyRequest().authenticated())
				.httpBasic(Customizer.withDefaults())
				.sessionManagement(httpSecConfig -> httpSecConfig
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(new AuthFilter(apiKey), UsernamePasswordAuthenticationFilter.class).build();

	}

	@Bean
	@ConditionalOnProperty(name = "security.enabled", havingValue = "false")
	public SecurityFilterChain disabledSecurityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(ahc -> ahc.disable())
				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
				.build();
	}
}