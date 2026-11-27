package com.l9_anagrams.entity;

import java.time.Instant;

import org.hibernate.annotations.SQLRestriction;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Una copia di carta posseduta dal giocatore.
 *
 * Il riciclo (POST /api/collection/recycle) la cancella in modo logico con recycle(): valorizza
 * recycled_at invece di eliminare la riga, e @SQLRestriction la esclude da tutte le query JPA/HQL
 * (repository, JPQL, collezioni come Deck.playerCards).
 * La riga resta perché altre tabelle la referenziano (pack_opening_card, in futuro gli scambi).
 *
 * Non si usa @SoftDelete di Hibernate: vieta le relazioni to-one LAZY verso l'entità
 * (PackOpeningCard.playerCard, Deck.ascendant) e le obbligherebbe a EAGER.
 * Attenzione: le query native NON applicano il filtro.
 */
@Entity
@SQLRestriction("recycled_at is null")
@Table (name = "player_card")
@Getter
@Setter
public class PlayerCard {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn (name = "player_id", nullable = false)
    private Player player;

    @ManyToOne (fetch = FetchType.LAZY, optional = false)
    @JoinColumn (name = "card_definition_id", nullable = false)
    private CardDefinition cardDefinition;

    // null = copia posseduta; valorizzata = riciclata (soft delete)
    @Column (name = "recycled_at")
    private Instant recycledAt;

    public PlayerCard() {

    }

    public PlayerCard(Player player, CardDefinition cardDefinition) {
        this.player = player;
        this.cardDefinition = cardDefinition;
    }

    /** Ricicla la copia: da qui in poi le query non la vedono più. */
    public void recycle(Instant when) {
        this.recycledAt = when;
    }

    public boolean isRecycled() {
        return recycledAt != null;
    }
}
