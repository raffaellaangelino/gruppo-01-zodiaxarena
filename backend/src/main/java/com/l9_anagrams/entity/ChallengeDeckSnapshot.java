package com.l9_anagrams.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.l9_anagrams.enums.God;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "challenge_deck_snapshot")
@Getter
@Setter
public class ChallengeDeckSnapshot {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private LocalDateTime capturedAt;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private God god;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ascendant_card_definition_id")
	private CardDefinition ascendantCardDefinition;

	@OneToMany(mappedBy = "deckSnapshot", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ChallengeDeckCardSnapshot> cardSnapshots = new ArrayList<>();
}
