package com.l9_anagrams.entity;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un mazzo (Cielo) del giocatore: fino a 3 per giocatore (limite controllato dal service).
 * Contiene 1 Ascendente e fino a 7 creature, come copie possedute (PlayerCard).
 */
@Entity
@Table(name = "deck", indexes = @Index(name = "idx_deck_player", columnList = "player_id"))
@Getter
@Setter
@NoArgsConstructor
public class Deck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ManyToOne senza unique: un giocatore ha da 1 a 3 mazzi
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    // Stessa lunghezza del @Size(max = 40) del DTO di richiesta
    @Column(nullable = false, length = 40)
    private String name;

    // Facoltativo: un mazzo senza Ascendente si salva come bozza (valid: false)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ascendant_card_id")
    private PlayerCard ascendant;

    // Le 7 creature. La stessa copia può stare in più mazzi dello stesso giocatore
    @ManyToMany
    @JoinTable(
            name = "deck_card",
            joinColumns = @JoinColumn(name = "deck_id"),
            inverseJoinColumns = @JoinColumn(name = "player_card_id"))
    private Set<PlayerCard> playerCards = new HashSet<>();

    // Aumenta a ogni salvataggio: servirà alla sfida (CHALLENGER_DECK_CHANGED)
    @Version
    private Long version;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touch() {
        updatedAt = Instant.now();
    }
}
