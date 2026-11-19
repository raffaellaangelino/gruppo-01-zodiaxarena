package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

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
}
