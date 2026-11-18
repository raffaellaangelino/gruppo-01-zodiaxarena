package com.l9_anagrams.entity;

import java.time.LocalDateTime;

import com.l9_anagrams.enums.MatchOutcome;
import com.l9_anagrams.enums.MatchStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "game_match")
@Getter
@Setter
public class Match {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "challenge_id", nullable = false, unique = true)
	private Challenge challenge;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "challenger_id", nullable = false)
	private Player challenger;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "challenged_id", nullable = false)
	private Player challenged;

	@ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinColumn(name = "challenger_deck_snapshot_id", nullable = false)
	private ChallengeDeckSnapshot challengerDeckSnapshot;

	@ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinColumn(name = "challenged_deck_snapshot_id", nullable = false)
	private ChallengeDeckSnapshot challengedDeckSnapshot;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MatchStatus status;

	@Enumerated(EnumType.STRING)
	private MatchOutcome outcome;

	@Column(name = "engine_seed")
	private Long engineSeed;

	@Column(name = "engine_payload", columnDefinition = "TEXT")
	private String enginePayload;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	private LocalDateTime completedAt;
}
