package com.l9_anagrams.repo;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.l9_anagrams.entity.Deck;


public interface DeckRepo extends JpaRepository<Deck, Long> {

    // ricerca mazzo tramite il suo ID primario
    @EntityGraph(attributePaths = { "ascendant", "ascendant.sign", "playerCards", "playerCards.cardDefinition", "playerCards.cardDefinition.sign", "playerCards.cardDefinition.planet" })
    Optional<Deck> findById(Long id);

    //* Mazzi del giocatore, completi di carte (composizione e validazione)
    // FindPlayerById restituisce una lista di mazzi associata all'ID del giocatore */
    //* EntityGraph assicura che la struttura del mazzo e delle sue carte venga caricata subito in memoria in una sola query JOIN */
    @EntityGraph(attributePaths = { "ascendant", "ascendant.sign", "playerCards", "playerCards.cardDefinition", "playerCards.cardDefinition.sign", "playerCards.cardDefinition.planet" })
    List<Deck> findByPlayerId(Long playerId);

    //* Validazione di proprietà Mazzo, verifica che il mazzo appartenga effettivamente al giocatore che sta eseguendo un'azione */
    //* Cerca un mazzo filtrando sia per Id del mazzo che per playerId del proprietario */
    @EntityGraph(attributePaths = { "ascendant", "ascendant.sign", "playerCards", "playerCards.cardDefinition", "playerCards.cardDefinition.sign", "playerCards.cardDefinition.planet" })
    Optional<Deck> findByAndPlayerId(Long id, Long PlayerId);

    //* Conteggio dei mazzi. Restituisce il numero totale di mazzi posseduti dal giocatore specificato */
    long countByPlayerId(Long playerId);

    //* Controllo Presenza Carta nei Mazzi */
    //* True se la carta è in almeno un mazzo (da controllare prima di uno scambio) */
    //* - impedisce lo scambio di una carta se questa fa attualmente parte di un mazzo 
    // - booleano che restituisce true se esiste almeno un mazzo che contiene nella sua collezione playerCards una carta con id pari a playerCardId */
    boolean existsByPlayerCardsId(Long playerCardId);

    //* Ricerca mazzi per Elenco Carte */
    /** Mazzi che contengono almeno una delle carte indicate 
     * la query individua quali mazzi contengono almeno una tra le carte passate come parametro
    */
    @Query("select distinct d from Deck d join d.playerCards pc where pc.id in :playerCardIds")
    List<Deck> findContainAnyPlayerCard(@Param ("playerCardIds") Collection<Long> playerCardIds);
}
