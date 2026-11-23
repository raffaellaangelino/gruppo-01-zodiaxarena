package com.l9_anagrams.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.PlayerCardResponseDto;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.repo.PlayerCardRepo;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.PlayerCardService;

@Service
public class PlayerCardServiceImpl implements PlayerCardService {

	private final PlayerCardRepo playerCardRepo;
	private final PlayerRepo playerRepo;

	public PlayerCardServiceImpl(PlayerCardRepo playerCardRepo, PlayerRepo playerRepo) {
		this.playerCardRepo = playerCardRepo;
		this.playerRepo = playerRepo;
	}

	@Override
	@Transactional(readOnly = true)
	public List<PlayerCardResponseDto> getAll() {
		return playerCardRepo.findAll().stream().map(PlayerCardResponseDto::from).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public List<PlayerCardResponseDto> getMine(String email) {
		Player player = currentPlayer(email);
		return playerCardRepo.findByPlayerId(player.getId()).stream()
				.map(PlayerCardResponseDto::from)
				.toList();
	}

	@Override
	@Transactional(readOnly = true)
	public PlayerCardResponseDto getById(Long id, String email) {
		Player player = currentPlayer(email);
		return playerCardRepo.findByIdAndPlayerId(id, player.getId())
				.map(PlayerCardResponseDto::from)
				.orElseThrow(() -> new ResourceNotFoundException("Carta non trovata"));
	}

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}
}