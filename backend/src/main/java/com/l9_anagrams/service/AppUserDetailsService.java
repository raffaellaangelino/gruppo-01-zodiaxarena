package com.l9_anagrams.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.l9_anagrams.entity.AppUser;
import com.l9_anagrams.repo.AppUserRepo;

@Service
public class AppUserDetailsService implements UserDetailsService {
	private final AppUserRepo repo;

	public AppUserDetailsService(AppUserRepo repo) {
		this.repo = repo;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AppUser u = repo.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

		return User
				.withUsername(u.getEmail())
				.password(u.getPasswordHash())
				.roles(u.getRole())
				.build();
	}

}

// TODO: rinominare classe?