package com.l9_anagrams.auth.userdetails;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public record AppUserPrincipal(
		Long userId,
		String email,
		String passwordHash,
		Collection<? extends GrantedAuthority> authorities) implements UserDetails {

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public String getPassword() {
		return passwordHash;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String toString() { // records print every field by default
		return "AppUserPrincipal[id=" + userId + ", email=" + email + "]";
	}
}
