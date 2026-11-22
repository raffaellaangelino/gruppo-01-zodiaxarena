package com.l9_anagrams.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un acquisto con apertura di pacchetto. Salva ciò che serve a ricostruire la risposta:
 * lo stesso Idempotency-Key restituisce questa apertura, e il riepilogo si recupera per id.
 */
@Entity
@Table(name = "pack_opening",
        uniqueConstraints = @UniqueConstraint(name = "uk_pack_opening_idempotency",
                columnNames = { "player_id", "idempotency_key" }),
        indexes = @Index(name = "idx_pack_opening_player_pack", columnList = "player_id, pack_id, opened_at"))
@Getter
@Setter
@NoArgsConstructor
public class PackOpening {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pack_id", nullable = false)
    private PackDefinition pack;

    // Header Idempotency-Key: un doppio clic o un nuovo tentativo non compra due volte
    @Column(nullable = false, length = 64)
    private String idempotencyKey;

    // Prezzo al momento dell'acquisto: il backoffice può cambiarlo dopo
    @Column(nullable = false)
    private int pricePaid;

    // Crediti dopo l'acquisto (balance della risposta)
    @Column(nullable = false)
    private long balanceAfter;

    // pityCounter dopo l'apertura (sunCounter.done della risposta)
    @Column(nullable = false)
    private int sunCounterAfter;

    // La Stella ha dato una Leggendaria (sunFound della risposta)
    @Column(nullable = false)
    private boolean sunFound;

    // Servirà anche al limite ONCE_PER_LUNAR_CYCLE
    @Column(nullable = false)
    private Instant openedAt;

    @OneToMany(mappedBy = "opening", cascade = CascadeType.PERSIST)
    @OrderBy("slotNumber")
    private List<PackOpeningCard> cards = new ArrayList<>();

    @PrePersist
    void onCreate() {
        if (openedAt == null) {
            openedAt = Instant.now();
        }
    }
}
