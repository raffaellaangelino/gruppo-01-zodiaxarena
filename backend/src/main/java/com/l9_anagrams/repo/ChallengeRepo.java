package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.l9_anagrams.entity.Challenge;
import com.l9_anagrams.enums.ChallengeStatus;

public interface ChallengeRepo extends JpaRepository<Challenge, Long> {
	Optional<Challenge> findByIdAndChallengerId(Long id, Long challengerId);
	Optional<Challenge> findByIdAndChallengedId(Long id, Long challengedId);
	boolean existsByChallengerIdAndChallengedIdAndStatus(Long challengerId, Long challengedId, ChallengeStatus status);
	boolean existsByChallengedIdAndChallengerIdAndStatus(Long challengedId, Long challengerId, ChallengeStatus status);
	List<Challenge> findByChallengedIdAndStatus(Long challengedId, ChallengeStatus status);
	List<Challenge> findByChallengerIdAndStatus(Long challengerId, ChallengeStatus status);
	List<Challenge> findByChallengedIdOrderByCreatedAtDesc(Long challengedId);
	List<Challenge> findByChallengerIdOrderByCreatedAtDesc(Long challengerId);

	/** Sfide "Da giocare": ricevute in attesa + giocate non ancora viste (stesso criterio di TO_PLAY). */
	@Query("""
			select count(c) from Challenge c
			where c.challenged.id = :playerId
			and (c.status = com.l9_anagrams.enums.ChallengeStatus.PENDING
				or (c.status = com.l9_anagrams.enums.ChallengeStatus.PLAYED and c.challengedReadAt is null))
			""")
	long countToPlay(@Param("playerId") Long playerId);
}
