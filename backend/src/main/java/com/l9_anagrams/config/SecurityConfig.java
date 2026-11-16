package com.l9_anagrams.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.l9_anagrams.filter.JwtAuthFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private static final String[] PUBLIC_ENDPOINTS = {
			"/api/auth/login",
			"/api/auth/register",
	};

	private static final String[] HEALTHCHECK_ENDPOINTS = {
			"/actuator/health",
	};

	private static final String[] SWAGGER_ENDPOINTS = {
			"/v3/api-docs/**",
			"/swagger-ui/**",
			"/swagger-ui.html",
			"/swagger-ui/"
	};

	@Bean
	@Profile("!securitydisabled")
	public SecurityFilterChain secureChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
		return http
				.csrf(csrf -> csrf.disable())
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(PUBLIC_ENDPOINTS).permitAll()
						.requestMatchers(HEALTHCHECK_ENDPOINTS).permitAll()
						.requestMatchers(SWAGGER_ENDPOINTS).permitAll()
						.anyRequest().authenticated())
				.exceptionHandling(
						e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	@Profile("securitydisabled")
	public SecurityFilterChain openChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
