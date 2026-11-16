package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.CardDefinition;

public interface CardDefinitionRepo extends JpaRepository<CardDefinition, Long> {
	@EntityGraph(attributePaths = { "sign", "planet" })
	List<CardDefinition> findAll();

	@EntityGraph(attributePaths = { "sign", "planet" })
	Optional<CardDefinition> findById(Long id);
}
