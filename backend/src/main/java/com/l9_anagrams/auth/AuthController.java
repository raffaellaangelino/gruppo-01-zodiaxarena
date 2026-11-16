package com.l9_anagrams.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l9_anagrams.exception.ApiErrorResponse;
import com.l9_anagrams.auth.dto.AuthResponseDto;
import com.l9_anagrams.auth.dto.LoginRequestDto;
import com.l9_anagrams.auth.dto.NicknameAvailabilityResponseDto;
import com.l9_anagrams.auth.dto.RegistrationPreviewRequestDto;
import com.l9_anagrams.auth.dto.RegistrationPreviewResponseDto;
import com.l9_anagrams.auth.jwt.JwtService;
import com.l9_anagrams.service.RegistrationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Login and registration onboarding endpoints")
public class AuthController {
	private final AuthenticationManager authManager;
	private final JwtService jwtService;
	private final RegistrationService registrationService;

	public AuthController(
			AuthenticationManager authManager,
			JwtService jwtService,
			RegistrationService registrationService) {
		this.authManager = authManager;
		this.jwtService = jwtService;
		this.registrationService = registrationService;
	}

	@PostMapping("/login")
	@Operation(summary = "Log in", description = "Authenticate with email and password and return a JWT.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Authentication succeeded", content = @Content(schema = @Schema(implementation = AuthResponseDto.class))),
			@ApiResponse(responseCode = "400", description = "Request validation failed", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
			@ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public AuthResponseDto login(@Valid @RequestBody LoginRequestDto req) {
		Authentication auth = authManager.authenticate(
				new UsernamePasswordAuthenticationToken(req.email(), req.password()));
		return new AuthResponseDto(jwtService.generateToken((UserDetails) auth.getPrincipal()));
	}

	@PostMapping("/register/preview")
	@Operation(summary = "Preview registration", description = "Calculate the Sun sign, proposed faction, and welcome package without creating an account.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Preview calculated", content = @Content(schema = @Schema(implementation = RegistrationPreviewResponseDto.class))),
			@ApiResponse(responseCode = "400", description = "Invalid birth date", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public RegistrationPreviewResponseDto previewRegistration(
			@Valid @RequestBody RegistrationPreviewRequestDto request) {
		return registrationService.preview(request.birthDate());
	}

	// TODO: apply rate limiting to this public availability endpoint.
	@GetMapping("/nickname-available")
	@Operation(summary = "Check nickname availability", description = "Check nickname format and whether it is already taken.")
	@ApiResponses({
			@ApiResponse(responseCode = "200", description = "Availability result; invalid or taken names are returned with a code", content = @Content(schema = @Schema(implementation = NicknameAvailabilityResponseDto.class))),
			@ApiResponse(responseCode = "400", description = "Nickname parameter is missing", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
	})
	public NicknameAvailabilityResponseDto checkNicknameAvailability(
			@Parameter(description = "Nickname to check", example = "star_player") @RequestParam String nickname) {
		return registrationService.checkNicknameAvailability(nickname);
	}

}
