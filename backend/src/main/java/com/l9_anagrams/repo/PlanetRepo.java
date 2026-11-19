package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.enums.PlanetTier;

public interface PlanetRepo extends JpaRepository<Planet, Long> {

    Optional<Planet> findByName(String name);

    // Verifica la presenza di un pianeta con quel determinato nome
    boolean existsByName(String name);

    List<Planet> findByTier(PlanetTier tier);

}
