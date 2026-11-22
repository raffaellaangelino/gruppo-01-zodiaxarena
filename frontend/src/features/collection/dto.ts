import type { Collection, OwnedCard } from '@/features/collection/types'

/**
 * Forma del backend per la collezione (`CollectionResponseDto`, contratto API §4.2), così come
 * arriva. Le pagine non la usano mai: passano da {@link toCollection}.
 */
export interface CollectionDto {
  progress: {
    creatures: { done: number; total: number }
    ascendants: { done: number; total: number }
  }
  duplicates: { copies: number; recycleValue: number }
  cards: {
    cardId: number
    quantity: number
    tradableCopies: number
    inDeck: boolean
    inOpenTrade: boolean
    isNew: boolean
    starter: boolean
    /** Data e ora senza fuso orario, oppure `null`. */
    obtainedAt: string | null
  }[]
}

/**
 * Traduce la collezione del backend nella forma dell'interfaccia.
 *
 * @param dto Collezione come la manda il backend.
 * @returns La collezione, con le carte possedute indicizzate per id del catalogo.
 */
export function toCollection(dto: CollectionDto): Collection {
  const owned = new Map<number, OwnedCard>(
    dto.cards.filter((c) => c.quantity > 0).map((c) => [c.cardId, { ...c }]),
  )
  return { progress: dto.progress, duplicates: dto.duplicates, owned }
}
