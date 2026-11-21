package com.l9_anagrams.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.l9_anagrams.entity.Match;

public interface MatchRepo extends JpaRepository<Match, Long> {

	/** La partita solo se chi la chiede è uno dei due giocatori (altrimenti vuoto → 404). */
	@Query("""
			select m from Match m
			join fetch m.challenge
			join fetch m.challenger
			join fetch m.challenged
			join fetch m.challengerDeckSnapshot
			join fetch m.challengedDeckSnapshot
			where m.id = :id and (m.challenger.id = :playerId or m.challenged.id = :playerId)
			""")
	Optional<Match> findByIdAndParticipant(@Param("id") Long id, @Param("playerId") Long playerId);
}
