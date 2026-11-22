import type { CardDefinition } from '@/features/cards/types'

/** Le otto caselle di un Cielo: una per pianeta, più l'Ascendente (contratto API §5). */
export type DeckSlot =
  'SOLE' | 'LUNA' | 'MARTE' | 'GIOVE' | 'SATURNO' | 'MERCURIO' | 'VENERE' | 'ASCENDANT'

/** Ordine delle caselle, come nel regolamento: i sette pianeti, poi l'Ascendente. */
export const DECK_SLOTS: readonly DeckSlot[] = [
  'SOLE',
  'LUNA',
  'MARTE',
  'GIOVE',
  'SATURNO',
  'MERCURIO',
  'VENERE',
  'ASCENDANT',
]

/**
 * Un Cielo del giocatore, nella forma dell'interfaccia. Validità e problemi sono quelli del
 * backend: l'interfaccia non ricalcola le regole V1–V8.
 */
export interface Deck {
  id: number
  name: string
  valid: boolean
  /** Quante regole il Cielo non rispetta (0 se valido). */
  problemCount: number
  /** Le carte nelle caselle piene, nell'ordine delle caselle. */
  cards: CardDefinition[]
  /** Caselle ancora vuote (il Cielo è una bozza). */
  emptySlots: number
}
