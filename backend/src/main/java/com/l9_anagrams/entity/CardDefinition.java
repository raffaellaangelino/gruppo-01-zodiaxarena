package com.l9_anagrams.entity;

import com.l9_anagrams.enums.CardType;
import com.l9_anagrams.enums.House;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "card_definition")
@Getter
@Setter
public class CardDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "house")
    private House house;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sign_id", nullable = false)
    private Sign sign;

    // **Null se type = ASCENDANT. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planet_id")
    private Planet planet;

    private String imgId;

    public CardDefinition() {

    }

    // CREATURA: ha sempre un pianeta
    public CardDefinition(Sign sign, Planet planet, String imgId) {
        this.type = CardType.CREATURE;
        this.house = House.I;
        this.sign = sign;
        this.planet = planet;
        this.imgId = imgId;
    }

    // Ascendente: nessun pianeta
    public CardDefinition(Sign sign, String imgId) {
        this.type = CardType.ASCENDANT;
        this.house = null;
        this.sign = sign;
        this.planet = null;
        this.imgId = imgId;
    }
}
