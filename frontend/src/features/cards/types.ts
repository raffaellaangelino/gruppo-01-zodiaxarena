import type { CardType, Element, PlanetCode, SignCode, Tier } from '@/domain/game'

/** Valori base di attacco e difesa (del segno o del pianeta). */
export interface StatPair {
  atk: number
  def: number
}

/**
 * Una carta del catalogo, nella forma dell'interfaccia. I valori sono quelli che manda il
 * backend: l'interfaccia non ricalcola le regole.
 */
export interface CardDefinition {
  id: number
  /** Codice stabile (nome dell'immagine senza estensione, es. `za-005-sole-leone`). */
  code: string
  type: CardType
  /** Nome stampato sulla carta ("Sole in Leone", "Ascendente Leone"). */
  name: string
  sign: SignCode
  element: Element
  /** Pianeta della Creatura; `null` per gli Ascendenti. */
  planet: PlanetCode | null
  tier: Tier
  /** Casa astrologica (`I` … `XII`); `null` per gli Ascendenti. */
  house: string | null
  /** Valori base del segno. Per l'Aria sono segnaposto: i veri si tirano con i dadi in partita. */
  signStats: StatPair
  /** Bonus del pianeta; `null` per gli Ascendenti. */
  planetStats: StatPair | null
  /** Illustrazione; `null` se manca il file (si mostra il dorso). */
  imageUrl: string | null
}
