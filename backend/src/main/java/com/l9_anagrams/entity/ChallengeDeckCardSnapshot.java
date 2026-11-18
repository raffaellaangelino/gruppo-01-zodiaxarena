package com.l9_anagrams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "challenge_deck_card_snapshot")
@Getter
@Setter
public class ChallengeDeckCardSnapshot {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "deck_snapshot_id", nullable = false)
	private ChallengeDeckSnapshot deckSnapshot;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "card_definition_id", nullable = false)
	private CardDefinition cardDefinition;

	@Column(nullable = false)
	private int position;
}
