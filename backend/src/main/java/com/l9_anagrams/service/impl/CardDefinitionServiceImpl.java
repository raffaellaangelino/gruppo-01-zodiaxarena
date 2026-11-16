package com.l9_anagrams.service.impl;

import com.l9_anagrams.repo.CardDefinitionRepo;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.l9_anagrams.dto.CardDefinitionResponseDto;
import com.l9_anagrams.service.CardDefinitionService;

@Service
public class CardDefinitionServiceImpl implements CardDefinitionService {

	private final CardDefinitionRepo repo;

	CardDefinitionServiceImpl(CardDefinitionRepo repo) {
		this.repo = repo;
	}

	@Override
	@Transactional(readOnly = true)
	public List<CardDefinitionResponseDto> getAll() {
		return repo.findAll().stream().map(CardDefinitionResponseDto::from).toList();
	}

}
