package com.l9_anagrams.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.l9_anagrams.dto.AuthResponse;
import com.l9_anagrams.dto.LoginRequest;
import com.l9_anagrams.dto.RegisterRequest;
import com.l9_anagrams.entity.AppUser;
import com.l9_anagrams.enums.Role;
import com.l9_anagrams.repo.AppUserRepo;
import com.l9_anagrams.service.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AppUserRepo repo;
	private final PasswordEncoder encoder;
	private final AuthenticationManager authManager;
	private final JwtService jwtService;
	private final UserDetailsService uds;

	public AuthController(
			AppUserRepo repo,
			PasswordEncoder encoder,
			AuthenticationManager authManager,
			JwtService jwtService,
			UserDetailsService uds) {
		this.repo = repo;
		this.encoder = encoder;
		this.authManager = authManager;
		this.jwtService = jwtService;
		this.uds = uds;
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest req) {
		authManager.authenticate(
				new UsernamePasswordAuthenticationToken(req.email(), req.password()));
		// throws BadCredentialsException if wrong -> map to 401
		return new AuthResponse(jwtService.generateToken(uds.loadUserByUsername(req.email())));
	}

	@PostMapping("/register")
	public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest req) {
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
