package com.l9_anagrams.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppUser {

	private Long id;
	private String email;
	private String passwordHash;
	private String role;

}

// TODO: configurare per JPA