package com.l9_anagrams.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.PlayerResponseDto;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.exception.ConflictException;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.enums.God;
import com.l9_anagrams.enums.OnboardingStep;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.PlayerService;
import java.time.LocalDateTime;

@Service
public class PlayerServiceImpl implements PlayerService {

	private final PlayerRepo playerRepo;

	public PlayerServiceImpl(PlayerRepo playerRepo) {
		this.playerRepo = playerRepo;
	}

	@Override
	@Transactional(readOnly = true)
	public List<PlayerResponseDto> getAll() {
		return playerRepo.findAll().stream().map(PlayerResponseDto::from).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public PlayerResponseDto getMe(String email) {
		return PlayerResponseDto.from(currentPlayer(email));
	}

	@Override
	@Transactional(readOnly = true)
	public PlayerResponseDto getById(Long id, String email) {
		Player me = currentPlayer(email);
		// 404 anche se esiste ma è di un altro: non si rivela l'esistenza
		if (!me.getId().equals(id)) {
			throw new ResourceNotFoundException("Giocatore non trovato");
		}
		return PlayerResponseDto.from(me);
	}

	@Override
	@Transactional
	public PlayerResponseDto chooseInitialFaction(String email, God god) {
		Player existing = playerRepo.findByAppUserEmail(email)
				.orElseThrow(
						() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
		Player player = playerRepo.findByForUpdate(existing.getId())
				.orElseThrow(
						() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
		if (player.getOnboardingStep() != OnboardingStep.FACTION) {
			throw new ConflictException("La fazione iniziale è già stata scelta");
		}
		player.setGod(god);
		player.setLastGodChange(LocalDateTime.now());
		player.setOnboardingStep(null);
		return PlayerResponseDto.from(player);
	}

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(
						() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}
}