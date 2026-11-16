package com.l9_anagrams.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
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

    public PlayerCard() {

    }

    public PlayerCard(Player player, CardDefinition cardDefinition) {
        this.player = player;
        this.cardDefinition = cardDefinition;
    }
}
