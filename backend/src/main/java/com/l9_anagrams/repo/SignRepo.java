package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.entity.SignType;


public interface SignRepo extends JpaRepository<Sign, Long> {

    Optional<Sign> findByName(String name);

    boolean existsByName (String name);

    List<Sign> findByType(SignType type);

    
}
