package com.l9_anagrams.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.PlayerSearchResponseDto;
import com.l9_anagrams.entity.Challenge;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.enums.ChallengeStatus;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.repo.ChallengeRepo;
import com.l9_anagrams.repo.PlayerRepo;

/** Cerca un avversario per nickname (Nuova sfida, tavolo dello scambio). */
@Service
public class PlayerSearchService {
	static final int MIN_QUERY_LENGTH = 3;

	private final PlayerRepo playerRepo;
	private final ChallengeRepo challengeRepo;

	public PlayerSearchService(PlayerRepo playerRepo, ChallengeRepo challengeRepo) {
		this.playerRepo = playerRepo;
		this.challengeRepo = challengeRepo;
	}

	@Transactional(readOnly = true)
	public PlayerSearchResponseDto search(String email, String query) {
		String text = query == null ? "" : query.trim();
		if (text.length() < MIN_QUERY_LENGTH) {
			return new PlayerSearchResponseDto(List.of());
		}
		Player me = playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));

		// Sfide in attesa tra me e ciascun avversario, in un verso o nell'altro
		Map<Long, Long> pendingByOpponent = new HashMap<>();
		for (Challenge challenge : challengeRepo.findByChallengerIdAndStatus(me.getId(), ChallengeStatus.PENDING)) {
			pendingByOpponent.put(challenge.getChallenged().getId(), challenge.getId());
		}
		for (Challenge challenge : challengeRepo.findByChallengedIdAndStatus(me.getId(), ChallengeStatus.PENDING)) {
			pendingByOpponent.put(challenge.getChallenger().getId(), challenge.getId());
		}

		List<PlayerSearchResponseDto.Item> items = playerRepo
				.findTop20ByNickNameContainingIgnoreCaseAndIdNotOrderByNickNameAsc(text, me.getId()).stream()
				.map(player -> new PlayerSearchResponseDto.Item(
						player.getId(), player.getNickName(), pendingByOpponent.get(player.getId())))
				.toList();
		return new PlayerSearchResponseDto(items);
	}
}
