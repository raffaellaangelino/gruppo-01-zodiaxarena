package com.l9_anagrams.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.l9_anagrams.service.JwtService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	public JwtAuthFilter(JwtService jwtService, UserDetailsService uds) {
		this.jwtService = jwtService;
		this.userDetailsService = uds;
	}

	@Override
	protected void doFilterInternal(
			HttpServletRequest req,
			HttpServletResponse res,
			FilterChain chain) throws ServletException, IOException {

		String header = req.getHeader("Authorization");
		if (header != null && header.startsWith("Bearer ")) {
			try {
				String username = jwtService.extractUsername(header.substring(7));
				if (SecurityContextHolder.getContext().getAuthentication() == null) {
					// TODO legge l'utente da db ad ogni richiesta, possibile utilizzare cache o
					// aggiungere i ruoli nel JWT
					UserDetails user = userDetailsService.loadUserByUsername(username);
					var auth = new UsernamePasswordAuthenticationToken(
							user, null, user.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			} catch (JwtException | UsernameNotFoundException e) {
				// invalid token: leave the request unauthenticated; Spring will return 401
			}
		}
		chain.doFilter(req, res);
	}
}
