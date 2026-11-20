package com.l9_anagrams.repo;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.l9_anagrams.entity.PlayerCard;
import com.l9_anagrams.enums.CardType;

import jakarta.persistence.LockModeType;

public interface PlayerCardRepo extends JpaRepository<PlayerCard, Long>{

    /** Collezione del giocatore, con carta, segno e pianeta già caricati
     * Recupera tutte le carte possedute dal giocatore per mostrare la sua collezione
     * restituisce la lista di tutte le carte nell'inventario dell'utente
     */
    @EntityGraph(attributePaths = {"cardDefinition", "cardDefinition.sign", "cardDefinition.planet"})
    List<PlayerCard> findByPlayerId(Long playerId);

    /** Dettaglio Carta e Possesso
     * ? chiedere al saggio se ha senso 
     * recupera una specifica carta (id) garantendo che appartenga a quel determinato giocatore(playerId). Utile per controlli di sicurezza.
    */
    @EntityGraph(attributePaths = { "cardDefinition", "cardDefinition.sign", "cardDefinition.planet"})
    Optional<PlayerCard> findByIdAndPlayerId(Long id, Long PlayerId);

    /** Validazione insieme di carte per scambi/mazzi 
     * se chiedi  carte e la query ne restituisce 4, significa che il giocatore stava tentando di usare/scambiare una carta che non possiede
    */
    @EntityGraph(attributePaths = {"cardDefinition", "cardDefinition.sign", "cardDefinition.planet"})
    List<PlayerCard> findByIdInAndPlayerId(Collection<Long> ids, Long playerId);

    // totale carte possedute dall'utente
    long countByPlayerId(Long playerId);

    //true se il giocatore possiede già almeno un'istanza di una specifica carta
    boolean existsByPlayerIdAndCardDefinitionId(Long playerId, Long cardDefinitionId);

    /** ricavare gli ID di tutte le carte già possedute dall'utente 
     * JPQL personalizzata con distinct per evitare duplicati se l'utente possiede più doppioni della stessa carta
    */
    @Query("select distinct pc.cardDefinition.id from PlayerCard pc where pc.player.id = :playerId")
    List<Long> findOwnedCardDefinitionIds(@Param("playerId") Long playerID);


    /** Doppioni per rarità/gacha 
     * metodo che supporta il meccanismo anti-doppione quando si aprono pacchetti per le carte di alta rarità
    */
    @Query("select distinct pc.cardDefinition.id from PlayerCard pc " + "where pc.player.id = :playerId and pc.cardDefinition.planet.tier = :tier")
    List<Long> findOwnedCardDefinitionIdsByTier(@Param("playerId") Long playerId, @Param("tier") int tier);

    /** Filtro carte possedute per tipo
     * per filtrare ascendenti o quali creature un utente possiede già (utile per completamente della collezione)
     */
    @Query("select distinct pc.cardDefinition.id from PlayerCard pc " + "where pc.player.id = :playerId and pc.cardDefinition.type = :type")
    List<Long> findOwnedCardDefinitionIdsByType(@Param("playerId") Long playerId, @Param("type") CardType type);

    /** Concorrenza e Blocco Scambi
     * impedisce che due transazioni contemporanee scambino la stessa carta due volte o creino un deadlock nel database
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select pc from PlayerCard pc where pc.id in :ids order by pc.id")
    List<PlayerCard> findAllByIdForUpdate(@Param("ids") Collection<Long> ids);
    
}
