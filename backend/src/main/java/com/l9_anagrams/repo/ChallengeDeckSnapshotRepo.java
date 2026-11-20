package com.l9_anagrams.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.ChallengeDeckSnapshot;

public interface ChallengeDeckSnapshotRepo extends JpaRepository<ChallengeDeckSnapshot, Long> {
}
