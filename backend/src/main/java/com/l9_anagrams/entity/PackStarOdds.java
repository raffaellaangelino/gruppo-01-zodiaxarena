package com.l9_anagrams.entity;

import java.math.BigDecimal;

import com.l9_anagrams.enums.CardRarity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Probabilità di una rarità nella Stella di un pacchetto (es. EPIC 0.30).
 * La somma per pacchetto deve fare 1: lo controlla il service all'apertura.
 */
@Entity
@Table(name = "pack_star_odds",
        uniqueConstraints = @UniqueConstraint(name = "uk_pack_star_odds_rarity", columnNames = { "pack_id", "rarity" }))
@Getter
@Setter
@NoArgsConstructor
public class PackStarOdds {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private PackDefinition pack;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CardRarity rarity;

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal probability;
}
