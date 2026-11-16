package com.l9_anagrams.auth.userdetails;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.l9_anagrams.auth.AppUserRepo;
import com.l9_anagrams.entity.AppUser;

@Service
public class AppUserDetailsService implements UserDetailsService {
	private final AppUserRepo repo;

	public AppUserDetailsService(AppUserRepo repo) {
		this.repo = repo;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AppUser u = repo.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

		return new AppUserPrincipal(
				u.getId(),
				u.getEmail(),
				u.getPasswordHash(),
				List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name())));
	}

}