package com.l9_anagrams.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.PackOpening;

public interface PackOpeningRepo extends JpaRepository<PackOpening, Long> {

	/**
	 * Idempotency-Key già usata da questo giocatore: si restituisce l'apertura salvata
	 * invece di comprare di nuovo (doppio clic, nuovo tentativo dopo un errore di rete).
	 */
	@EntityGraph(attributePaths = { "pack", "cards", "cards.cardDefinition" })
	Optional<PackOpening> findByPlayerIdAndIdempotencyKey(Long playerId, String idempotencyKey);

	/**
	 * Riepilogo di un'apertura (GET /api/shop/openings/{openingId}).
	 * Filtra anche per giocatore: l'apertura di un altro risponde 404.
	 */
	@EntityGraph(attributePaths = { "pack", "cards", "cards.cardDefinition" })
	Optional<PackOpening> findByIdAndPlayerId(Long id, Long playerId);

	/**
	 * Ultima apertura di un pacchetto da parte del giocatore.
	 * Servirà al limite ONCE_PER_LUNAR_CYCLE (LIMIT_REACHED, availableAgainAt): per ora è un TODO.
	 */
	Optional<PackOpening> findFirstByPlayerIdAndPackIdOrderByOpenedAtDesc(Long playerId, Long packId);
}
