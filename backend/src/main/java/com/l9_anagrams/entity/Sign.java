package com.l9_anagrams.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table (name = "sign")
@Getter 
@Setter 
public class Sign {

    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    /**Elemento */
    @Enumerated (EnumType.STRING)
    @Column(nullable = false)
    private SignType type;

    @Column(nullable = false)
    private int def;

    @Column(nullable = false)
    private int atk;

    public Sign() {

    }

    public Sign(String name, SignType type, int def, int atk) {
        this.name = name;
        this.type = type;
        this.def = def;
        this.atk = atk;
    }

}
