package com.l9_anagrams.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.Match;

public interface MatchRepo extends JpaRepository<Match, Long> {
}
