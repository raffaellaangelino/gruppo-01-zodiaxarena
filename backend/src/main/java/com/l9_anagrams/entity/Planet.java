package com.l9_anagrams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table (name = "planet")
@Getter 
@Setter 
public class Planet {

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false, unique = true)
    private String name;

    /**Rarità */
    @Column (nullable = false) 
    private int tier;

    @Column (nullable = false)
    private int def;

    @Column (nullable = false)
    private int atk;

    public Planet() {

    }

    public Planet(String name, int tier, int def, int atk) {
        this.name = name;
        this.tier = tier;
        this.def = def;
        this.atk = atk;
    }
}
