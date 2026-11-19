package com.l9_anagrams.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.auth.AppUserRepo;
import com.l9_anagrams.dto.PlayerRequestDto;
import com.l9_anagrams.dto.PlayerResponseDto;
import com.l9_anagrams.entity.AppUser;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.exception.ConflictException;
import com.l9_anagrams.exception.ResourceNotFoundException;
import com.l9_anagrams.repo.PlayerRepo;
import com.l9_anagrams.service.PlayerService;

@Service
public class PlayerServiceImpl implements PlayerService {

	// Regolamento, sezione "Benvenuto": 300 crediti alla registrazione
	private static final long WELCOME_CREDITS = 300;

	private final PlayerRepo playerRepo;
	private final AppUserRepo appUserRepo;

	public PlayerServiceImpl(PlayerRepo playerRepo, AppUserRepo appUserRepo) {
		this.playerRepo = playerRepo;
		this.appUserRepo = appUserRepo;
	}

	@Override
	@Transactional(readOnly = true)
	public List<PlayerResponseDto> getAll() {
		return playerRepo.findAll().stream().map(PlayerResponseDto::from).toList();
	}

	// TODO: passare id al posto della mail 
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
	public PlayerResponseDto create(String email, PlayerRequestDto request) {
		AppUser user = appUserRepo.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Utente non trovato"));
		if (playerRepo.existsByAppUserId(user.getId())) {
			throw new ConflictException("Il giocatore esiste già per questo utente");
		}
		String nickName = request.nickName().trim();
		if (playerRepo.existsByNickName(nickName)) {
			throw new ConflictException("Nickname già in uso");
		}

		Player player = new Player(user, nickName);
		player.setBirthDate(request.birthDate());
		player.setGod(request.god());
		player.setCredits(WELCOME_CREDITS);
		// TODO: calcolare sunSign dalla data di nascita (libreria astronomica)
		// TODO: regalo "Il tuo primo cielo" (7 carte), da decidere con il team
		return PlayerResponseDto.from(playerRepo.save(player));
	}

	private Player currentPlayer(String email) {
		return playerRepo.findByAppUserEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Giocatore non trovato per l'utente corrente"));
	}
}