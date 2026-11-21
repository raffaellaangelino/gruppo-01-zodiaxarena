package com.l9_anagrams.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.auth.dto.RegisterRequestDto;
import com.l9_anagrams.auth.dto.RegistrationResponseDto;
import com.l9_anagrams.auth.jwt.JwtService;
import com.l9_anagrams.exception.ApiErrorResponse;
import com.l9_anagrams.service.RegistrationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Registration", description = "Account creation and welcome package")
public class RegistrationController {
	private final RegistrationService registrationService;
	private final UserDetailsService userDetailsService;
	private final JwtService jwtService;

	public RegistrationController(
			RegistrationService registrationService,
			UserDetailsService userDetailsService,
			JwtService jwtService) {
		this.registrationService = registrationService;
		this.userDetailsService = userDetailsService;
		this.jwtService = jwtService;
	}

	@PostMapping("/register")
	@Operation(summary = "Register", description = "Create an account and player, grant starter assets, and return a JWT.")
	@ApiResponses({
			@ApiResponse(responseCode = "201", description = "Registration completed", content = @Content(schema = @Schema(implementation = RegistrationResponseDto.class))),
			@ApiResponse(responseCode = "400", description = "Invalid registration data or missing consent", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "409", description = "Email or nickname already taken", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public ResponseEntity<RegistrationResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
		RegistrationService.RegistrationResult result = registrationService.register(request);
		String token = jwtService.generateToken(userDetailsService.loadUserByUsername(result.email()));
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(new RegistrationResponseDto(token, result.player(), result.proposedFaction()));
	}
}