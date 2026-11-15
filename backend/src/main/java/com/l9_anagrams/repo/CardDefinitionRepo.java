package com.l9_anagrams.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.CardType;

public interface CardDefinitionRepo extends JpaRepository<CardDefinition, Long> {
	@EntityGraph(attributePaths = { "sign", "planet" })
	List<CardDefinition> findAll();

	@EntityGraph(attributePaths = { "sign", "planet" })
	Optional<CardDefinition> findById(Long id);

	@EntityGraph(attributePaths = { "sign", "planet" })
	List<CardDefinition> findByAllById(Iterable<Long> ids);

	/** Tutte le creature oppure tutti gli Ascendenti (catalogo, backOffice) 
	 * Filtra il catalogo per tipologia
	 * Recupera tutte le carte appartenenti ad un determinato CardType
	*/
	@EntityGraph(attributePaths = { "sign", "planet" })
	List<CardDefinition> findByType(CardType type);

	/** Filtraggio per tipo e rarità/tier del pianeta */
	@EntityGraph(attributePaths = { "sign", "planet"})
	List<CardDefinition> findByTypeAndPlanetTier(CardType type, int tier);

	/** Carta "pianeta + segno": serve al mazzo natale e alla validazione V7 
	 * per recuperare la carta specifica associata a una combinazione unica di pianeta e segno zodiacale.
	*/
	@EntityGraph(attributePaths = { "sign", "planet"})
	Optional<CardDefinition> findByPlanetIdAndSignId(Long planetId, Long signId);

	/** Ascendente di un segno l'ascendente è la carta senza pianeta) 
	 * chiarimento regole: una carta di tipo Ascendente è legata a un segno zodiacale ma non ha un pianeta associato (planet == null)
	*/
	@EntityGraph (attributePaths = { "sign"})
	Optional<CardDefinition> findBySignIdAndPlanetIsNull(Long signId);

	/** Restituisce tre se nel db esiste già una combinazione di quel pianeta con quel segno, senza bisogno
	 * di caricare l'intera entità CardDefinition in memoria.
	 */
	boolean existsByPlanetIdAndSignId(Long planetId, Long signId);
}
