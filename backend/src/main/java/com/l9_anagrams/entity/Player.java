package com.l9_anagrams.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.l9_anagrams.enums.God;
import com.l9_anagrams.enums.OnboardingStep;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "player")
@Getter
@Setter
public class Player {

    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId
    @JoinColumn(name = "id")
    private AppUser appUser;

    @Column(nullable = false, unique = true)
    private String nickName;

    @Column(nullable = false)
    private long credits = 0;

    @Enumerated(EnumType.STRING)
    private God god;

    private LocalDateTime lastGodChange;

    @Column(nullable = false)
    private int pityCounter = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sun_sign_id")
    private Sign sunSign;

    @Enumerated(EnumType.STRING)
    @Column(name = "onboarding_step")
    private OnboardingStep onboardingStep;

    @OneToMany(mappedBy = "player")
    private List<PlayerCard> playerCards = new ArrayList<>();

    @OneToMany(mappedBy = "player")
    private List<Deck> decks = new ArrayList<>();

    public Player() {

    }

    public Player(AppUser appUser, String nickName) {
        this.appUser = appUser;
        this.nickName = nickName;
    }
}
