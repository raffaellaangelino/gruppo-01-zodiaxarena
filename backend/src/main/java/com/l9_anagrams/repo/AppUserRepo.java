package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import com.l9_anagrams.entity.AppUser;

@Repository
public class AppUserRepo {

	// TEMP
	List<AppUser> appUsers = List.of(
			new AppUser(1l,
					"email@example.com",
					new BCryptPasswordEncoder().encode("password"),
					"USER"));

	public Optional<AppUser> findByEmail(String email) {
		AppUser foundUser = null;
		for (AppUser appUser : appUsers) {
			if (appUser.getEmail().equals(email)) {
				foundUser = appUser;
				break;
			}
		}
		return Optional.ofNullable(foundUser);
	}

	public boolean existsByEmail(String email) {
		for (AppUser appUser : appUsers) {
			if (appUser.getEmail().equals(email)) {
				return true;
			}
		}
		return false;
	}

	public void save(AppUser u) {
		appUsers.add(u);
	}
}

// TODO: convertire in interfaccia JPA