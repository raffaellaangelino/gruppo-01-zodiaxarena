package com.l9_anagrams.auth.config;

import java.io.IOException;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.l9_anagrams.auth.jwt.JwtAuthFilter;
import com.l9_anagrams.exception.ApiErrorCode;
import com.l9_anagrams.exception.ApiErrorResponse;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.json.JsonMapper;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private static final JsonMapper ERROR_MAPPER = JsonMapper.builder().build();

	private static final String[] PUBLIC_ENDPOINTS = {
			"/api/auth/login",
			"/api/auth/register",
			"/api/auth/register/preview",
			"/api/auth/nickname-available",
			// Spring inoltra ogni errore a /error: se fosse protetto, 404/409/422
			// arriverebbero al client come 401 (contratto §1.2, issue #48)
			"/error",
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
						.dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
						.requestMatchers(PUBLIC_ENDPOINTS).permitAll()
						.requestMatchers(HEALTHCHECK_ENDPOINTS).permitAll()
						.requestMatchers(SWAGGER_ENDPOINTS).permitAll()
						.anyRequest().authenticated())
				.exceptionHandling(e -> e
						.authenticationEntryPoint((request, response, exception) -> writeError(
								response, HttpStatus.UNAUTHORIZED,
								ApiErrorCode.UNAUTHORIZED,
								"Authentication is required"))
						.accessDeniedHandler((request, response, exception) -> writeError(
								response, HttpStatus.FORBIDDEN, ApiErrorCode.FORBIDDEN,
								"Access denied")))
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

	private static void writeError(
			HttpServletResponse response,
			HttpStatus status,
			ApiErrorCode code,
			String message) throws IOException {
		response.setStatus(status.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		ERROR_MAPPER.writeValue(response.getOutputStream(),
				new ApiErrorResponse(status.value(), code.name(), message, Map.of()));
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
