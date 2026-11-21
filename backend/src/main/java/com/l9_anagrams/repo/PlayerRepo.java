package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.l9_anagrams.entity.Player;

import jakarta.persistence.LockModeType;

public interface PlayerRepo extends JpaRepository<Player, Long> {

    @EntityGraph(attributePaths = { "sunSign" })
    Optional<Player> findByAppUserId(Long userId);

    // cerca il giocatore partendo dall'email dell'utente associato
    @EntityGraph(attributePaths = { "sunSign" })
    Optional<Player> findByAppUserEmail(String email);

    Optional<Player> findByNickName(String nickName);

    boolean existsByNickName(String nickName);

    // Ricerca avversari: nickname che contiene il testo, escluso chi cerca
    List<Player> findTop20ByNickNameContainingIgnoreCaseAndIdNotOrderByNickNameAsc(String text, Long excludedId);

    boolean existsByNickNameIgnoreCase(String nickName);

    boolean existsByAppUserId(Long userId);

    // Quando una transazione legge quel player, blocca la riga a livello di
    // database finché la transazione non termina
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Player p where p.id = :id")
    Optional<Player> findByForUpdate(@Param("id") Long id);

    /**
     * FlushAutomaticallY = forza il salvataggio su DB di eventuali modifiche
     * pendenti nel Persistence Context prima di eseguire l'update
     * ClearAutomatically = svuota la cache di primo livello dopo l'update,
     * eventuali letture successive dello stesso Player nella stessa transazione
     * rileggeranno il saldo aggiornato dal DB invece che utilizzare il vecchio
     * valore in memoria
     * Viene restituito 1 se il giocatore esisteva e aveva abbastanza crediti
     * Resituito 0 = se il saldo era insufficiente impedendo così saldi negativi
     * senza dover prima legggere l'entità in memoria
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update Player p set p.credits = p.credits - :amount "
            + "where p.id = :id and p.credits >= :amount")
    int spendCredits(@Param("id") Long id, @Param("amount") long amount);

    /**
     * Accredita i crediti
     * In caso di due premi riscattati nello stesso millisecondo, il database accoda
     * gli update e somma entrambi correttamente senza sovrascrivere i valori
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update Player p set p.credits = p.credits + :amount where p.id = :id")
    int addCredits(@Param("id") Long id, @Param("amount") long amount);

}
