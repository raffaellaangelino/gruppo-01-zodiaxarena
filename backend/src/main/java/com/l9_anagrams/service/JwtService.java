package com.l9_anagrams.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.l9_anagrams.properties.JwtProperties;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private final SecretKey key;
	private final long expirationMs;

	public JwtService(JwtProperties prop) {
		this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(prop.secretKey()));
		this.expirationMs = prop.expirationMs();
	}

	public String generateToken(UserDetails user) {
		Date now = new Date();
		return Jwts.builder()
				.subject(user.getUsername())
				.issuedAt(now)
				.expiration(new Date(now.getTime() + expirationMs))
				.signWith(key)
				.compact();
	}

	public String extractUsername(String token) {
		return Jwts.parser().verifyWith(key).build()
				.parseSignedClaims(token).getPayload().getSubject();
	}
}
