import type { CardDefinition } from '@/features/cards/types'

/** Avanzamento: quante carte diverse si hanno su quante esistono. */
export interface ProgressCount {
  done: number
  total: number
}

/** Una carta posseduta, come la racconta il backend (`GET /api/collection`, contratto §4.2). */
export interface OwnedCard {
  cardId: number
  quantity: number
  /** Copie che si possono scambiare (oggi il backend manda ancora la quantità). */
  tradableCopies: number
  /** È nel Cielo del giocatore. */
  inDeck: boolean
  inOpenTrade: boolean
  /** Mai vista: badge "Nuova" finché il giocatore non apre la Collezione. */
  isNew: boolean
  /** Carta del primo cielo. */
  starter: boolean
  obtainedAt: string | null
}

/** La collezione del giocatore. */
export interface Collection {
  progress: { creatures: ProgressCount; ascendants: ProgressCount }
  duplicates: { copies: number; recycleValue: number }
  /** Carte possedute per id del catalogo. */
  owned: ReadonlyMap<number, OwnedCard>
}

/** Una posizione dell'album: ogni carta del catalogo, posseduta o no. */
export interface CollectionEntry {
  card: CardDefinition
  /** Numero di catalogo stampato sulla carta ("005"; per gli Ascendenti "A05"). */
  number: string
  /** Ordine dell'album: Creature 1–84, poi Ascendenti. */
  order: number
  /** `null` se il giocatore non ce l'ha. */
  owned: OwnedCard | null
}
