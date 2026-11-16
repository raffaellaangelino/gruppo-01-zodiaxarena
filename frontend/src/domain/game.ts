/**
 * Tipi del dominio di gioco condivisi tra le funzioni, con i codici del contratto API
 * (§1). I nomi da mostrare stanno in `domain/labels.ts`.
 */

/** I quattro elementi (enum di sistema, come `SignType` nel backend). */
export type Element = 'FIRE' | 'WATER' | 'EARTH' | 'AIR'

/** Rarità: decisa dal pianeta; gli Ascendenti hanno la loro. */
export type Tier = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'ASCENDANT'

/** I sette pianeti, uno per slot del Cielo. */
export type PlanetCode = 'SOLE' | 'LUNA' | 'MARTE' | 'GIOVE' | 'SATURNO' | 'MERCURIO' | 'VENERE'

/** I dodici segni. */
export type SignCode =
  | 'ARIETE'
  | 'TORO'
  | 'GEMELLI'
  | 'CANCRO'
  | 'LEONE'
  | 'VERGINE'
  | 'BILANCIA'
  | 'SCORPIONE'
  | 'SAGITTARIO'
  | 'CAPRICORNO'
  | 'ACQUARIO'
  | 'PESCI'

/** I Dei delle Fazioni (Ade arriva in fase 2). */
export type GodCode = 'EFESTO' | 'POSEIDONE' | 'DEMETRA' | 'ERA'

/** Fazione del giocatore: il Dio scelto e l'elemento che favorisce. */
export interface Faction {
  god: GodCode
  element: Element
}

/** Miniatura di una carta, per ventagli e liste. */
export interface CardThumb {
  id: number
  /** Codice stabile del catalogo (es. `SOLE-LEONE-I`). */
  code: string
  imageUrl: string
}

/** Avanzamento "fatti su totale" (missioni, sfide premiate, contatore del Sole). */
export interface Progress {
  done: number
  total: number
}

/**
 * Un altro giocatore, ovunque compaia. La Fazione si conosce solo dopo averlo affrontato
 * (D-014): prima è `null` e l'interfaccia mostra l'iniziale.
 */
export interface PlayerRef {
  id: number
  nickname: string
  faction: Faction | null
  /** Vero se lo hai già affrontato almeno una volta. */
  faced: boolean
}
