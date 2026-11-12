package com.l9_anagrams.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "deck")
@Data
public class Deck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id", nullable = false, unique = true)
    private Player player;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ascendant_id")
    private PlayerCard ascendant;

    @ManyToMany
    @JoinTable(name = "deck_player_card", joinColumns = @JoinColumn(name = "deck_id"), inverseJoinColumns = @JoinColumn(name = "player_card-id"))
    private List<PlayerCard> playerCards = new ArrayList<>();
}
