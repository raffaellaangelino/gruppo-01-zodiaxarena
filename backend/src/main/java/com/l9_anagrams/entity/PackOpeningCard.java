package com.l9_anagrams.entity;

import com.l9_anagrams.enums.PackSlotType;

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

/** Una carta uscita da un'apertura, nello slot in cui è uscita. */
@Entity
@Table(name = "pack_opening_card",
        uniqueConstraints = @UniqueConstraint(name = "uk_pack_opening_card_slot",
                columnNames = { "opening_id", "slot_number" }))
@Getter
@Setter
@NoArgsConstructor
public class PackOpeningCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opening_id", nullable = false)
    private PackOpening opening;

    @Column(nullable = false)
    private int slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PackSlotType slotType;

    // È il cardId della risposta
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "card_definition_id", nullable = false)
    private CardDefinition cardDefinition;

    // La copia creata nella collezione del giocatore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_card_id", nullable = false)
    private PlayerCard playerCard;

    // Fissato all'apertura: il riepilogo resta uguale anche se poi il giocatore trova altre copie
    @Column(name = "is_new", nullable = false)
    private boolean newCard;
}
