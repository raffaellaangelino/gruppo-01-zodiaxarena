package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.PackDefinition;

public interface PackDefinitionRepo extends JpaRepository<PackDefinition, Long> {

	/**
	 * Pacchetti in vendita, nell'ordine del Negozio (GET /api/shop/packs).
	 * Gli slot arrivano nello stesso JOIN; le probabilità della Stella con @BatchSize.
	 */
	@EntityGraph(attributePaths = { "slots" })
	List<PackDefinition> findByActiveTrueOrderBySortOrderAsc();

	/** Pacchetto da comprare (POST /api/shop/packs/{code}/purchase): i ritirati non si trovano. */
	@EntityGraph(attributePaths = { "slots" })
	Optional<PackDefinition> findByCodeAndActiveTrue(String code);
}
