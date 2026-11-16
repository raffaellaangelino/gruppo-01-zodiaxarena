package com.l9_anagrams.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.l9_anagrams.auth.dto.AuthResponseDto;
import com.l9_anagrams.auth.dto.LoginRequestDto;
import com.l9_anagrams.auth.dto.RegisterRequestDto;
import com.l9_anagrams.auth.jwt.JwtService;
import com.l9_anagrams.entity.AppUser;
import com.l9_anagrams.enums.Role;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AppUserRepo repo;
	private final PasswordEncoder encoder;
	private final AuthenticationManager authManager;
	private final JwtService jwtService;

	public AuthController(
			AppUserRepo repo,
			PasswordEncoder encoder,
			AuthenticationManager authManager,
			JwtService jwtService) {
		this.repo = repo;
		this.encoder = encoder;
		this.authManager = authManager;
		this.jwtService = jwtService;
	}

	@PostMapping("/login")
	public AuthResponseDto login(@Valid @RequestBody LoginRequestDto req) {
		Authentication auth = authManager.authenticate(
				new UsernamePasswordAuthenticationToken(req.email(), req.password()));
		return new AuthResponseDto(jwtService.generateToken((UserDetails) auth.getPrincipal()));
	}

	// TODO muovere logica in RegistrationService
	@PostMapping("/register")
	public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequestDto req) {
		if (repo.existsByEmail(req.email())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
		}
		AppUser u = new AppUser();
		u.setEmail(req.email());
		u.setPasswordHash(encoder.encode(req.password()));
		u.setRole(Role.USER);
		repo.save(u);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}
}
