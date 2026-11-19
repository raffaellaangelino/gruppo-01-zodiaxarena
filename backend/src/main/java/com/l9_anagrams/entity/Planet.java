package com.l9_anagrams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.l9_anagrams.enums.PlanetTier;

@Entity
@Table(name = "planet")
@Getter
@Setter
public class Planet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    /** Rarità */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanetTier tier;

    @Column(nullable = false)
    private int def;

    @Column(nullable = false)
    private int atk;

    public Planet() {

    }

    public Planet(String name, PlanetTier tier, int def, int atk) {
        this.name = name;
        this.tier = tier;
        this.def = def;
        this.atk = atk;
    }
}
