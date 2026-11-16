package com.l9_anagrams.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.AppUser;

public interface AppUserRepo extends JpaRepository<AppUser, Long> {

	public Optional<AppUser> findByEmail(String email);

	public boolean existsByEmail(String email);
}