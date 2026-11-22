package com.l9_anagrams.enums;

/**
 * Garanzie mostrate nel Negozio. Non si salvano: si ricavano dagli slot del pacchetto,
 * così non possono promettere qualcosa che il pacchetto non contiene.
 */
public enum PackGuarantee {
	// Il pacchetto ha una Stella: conta per il Sole garantito
	SUN_WITHIN_10_STARS,
	// Il pacchetto ha una Stella: Epiche e Leggendarie non escono doppie finché non le hai tutte
	NO_DUPLICATE_EPIC_LEGENDARY,
	// Slot fisso di quella rarità
	EPIC,
	LEGENDARY,
	ASCENDANT
}
