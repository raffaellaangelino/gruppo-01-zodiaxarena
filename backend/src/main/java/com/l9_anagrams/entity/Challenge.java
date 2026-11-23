package com.l9_anagrams.entity;

import java.time.LocalDateTime;

import com.l9_anagrams.enums.ChallengeCancelReason;
import com.l9_anagrams.enums.ChallengeStatus;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "challenge")
@Getter
@Setter
public class Challenge {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinColumn(name = "challenger_id", nullable = false)
	private Player challenger;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "challenged_id", nullable = false)
	private Player challenged;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ChallengeStatus status;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "challenger_deck_snapshot_id", nullable = false)
	private ChallengeDeckSnapshot challengerDeckSnapshot;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false)
	private LocalDateTime updatedAt;

	private LocalDateTime expiresAt;
	private LocalDateTime challengedReadAt;
	private LocalDateTime challengerReadAt;

	@OneToOne(mappedBy = "challenge")
	private Match match;

	@Enumerated(EnumType.STRING)
	private ChallengeCancelReason cancelReason;
}
