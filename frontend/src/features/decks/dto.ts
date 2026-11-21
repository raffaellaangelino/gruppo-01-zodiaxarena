import type { Catalog } from '@/features/cards/queries'
import { DECK_SLOTS, type Deck, type DeckSlot } from '@/features/decks/types'

/** Una regola non rispettata (`DeckProblem`): `element` solo per le regole sugli elementi. */
interface DeckProblemDto {
  rule: string
  code: string
  element?: string
}

/**
 * Un mazzo come lo manda il backend (`GET /api/decks/{id}`, `DeckResponse`): la forma del contratto
 * §5.1 più `id` e `updatedAt`. `slots` ha sempre le 8 chiavi, con l'id della carta del catalogo
 * oppure `null` se la casella è vuota.
 */
export interface DeckDto {
  id: number
  name: string
  updatedAt: string
  slots: Record<DeckSlot, number | null>
  valid: boolean
  problems: DeckProblemDto[]
  elementBalance: Record<string, number>
  effectiveStats: Record<string, unknown>
}

/**
 * Traduce un mazzo del backend nella forma dell'interfaccia, con le carte prese dal catalogo.
 *
 * @param dto Mazzo come lo manda il backend.
 * @param catalog Il catalogo, per riconoscere le carte dal loro id.
 * @returns Il Cielo.
 * @throws {Error} Se una carta non è nel catalogo: meglio fermarsi che mostrare un Cielo sbagliato.
 */
export function toDeck(dto: DeckDto, catalog: Catalog): Deck {
  const ids = DECK_SLOTS.map((slot) => dto.slots[slot] ?? null)
  const cards = ids
    .filter((id): id is number => id !== null)
    .map((id) => {
      const card = catalog.byId.get(id)
      if (!card) throw new Error(`Mazzo ${dto.id}: carta ${id} non trovata nel catalogo`)
      return card
    })
  return {
    id: dto.id,
    name: dto.name,
    valid: dto.valid,
    problemCount: dto.problems.length,
    cards,
    emptySlots: ids.length - cards.length,
  }
}
