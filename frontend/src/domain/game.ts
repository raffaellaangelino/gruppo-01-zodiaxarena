/**
 * Tipi del dominio di gioco condivisi tra le funzioni (regolamento: elementi, carte, Fazioni).
 */

/** I quattro elementi del gioco. */
export type Element = 'fuoco' | 'acqua' | 'terra' | 'aria'

/** Miniatura di una carta, per ventagli e liste. */
export interface CardThumb {
  /** Identificativo della carta. */
  id: string
  /** Nome leggibile (es. "Sole in Ariete"), usato come testo alternativo. */
  name: string
  /** Indirizzo dell'immagine. */
  imageUrl: string
}

/** Fazione del giocatore: il Dio scelto e il suo elemento. */
export interface Faction {
  /** Nome del Dio (es. "Efesto"). */
  god: string
  /** Elemento favorito dalla Fazione. */
  element: Element
  /** Effetto in una riga (es. "+2 ATK al Fuoco"). */
  effect: string
}

/** Avanzamento "fatti su totale" (missioni, sfide premiate, contatore del Sole). */
export interface Progress {
  done: number
  total: number
}
