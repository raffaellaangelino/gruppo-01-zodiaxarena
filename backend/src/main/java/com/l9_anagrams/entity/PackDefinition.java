package com.l9_anagrams.entity;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.BatchSize;

import com.l9_anagrams.enums.PackPurchaseLimit;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Un pacchetto in vendita nel Negozio. Prezzo, slot e probabilità della Stella stanno nel DB:
 * il backoffice li cambia senza toccare il codice.
 * Numero di carte e garanzie non si salvano: si ricavano dagli slot.
 */
@Entity
@Table(name = "pack_definition")
@Getter
@Setter
@NoArgsConstructor
public class PackDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Chiave stabile usata nell'URL: COSTELLAZIONE, ZENIT, LUNA_PIENA
    @Column(nullable = false, unique = true, length = 30)
    private String code;

    @Column(nullable = false, length = 40)
    private String name;

    // Sottotitolo mostrato nel Negozio ("Il pacchetto di tutti i giorni")
    @Column(length = 120)
    private String role;

    @Column(nullable = false)
    private int price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PackPurchaseLimit purchaseLimit = PackPurchaseLimit.NONE;

    // Null = già in vendita; data futura = NOT_YET_RELEASED
    private Instant releasedAt;

    // False = ritirato: non compare nel Negozio e non si compra
    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private int sortOrder;

    @OneToMany(mappedBy = "pack")
    @OrderBy("slotNumber")
    private List<PackSlot> slots = new ArrayList<>();

    // Hibernate non carica due liste nello stesso JOIN: gli slot arrivano con l'EntityGraph del repository,
    // le probabilità con una sola query in più per tutti i pacchetti del Negozio
    @OneToMany(mappedBy = "pack")
    @BatchSize(size = 20)
    private List<PackStarOdds> starOdds = new ArrayList<>();
}
