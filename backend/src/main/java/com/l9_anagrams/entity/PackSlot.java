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

/** Una posizione del pacchetto (1..N) con la rarità che vi esce, oppure la Stella. */
@Entity
@Table(name = "pack_slot",
        uniqueConstraints = @UniqueConstraint(name = "uk_pack_slot_number", columnNames = { "pack_id", "slot_number" }))
@Getter
@Setter
@NoArgsConstructor
public class PackSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private PackDefinition pack;

    // Ordine di rivelazione: la Stella è l'ultimo slot
    @Column(nullable = false)
    private int slotNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PackSlotType slotType;
}
