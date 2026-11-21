import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { fetchCatalog } from '@/features/cards/api'
import type { CardDefinition } from '@/features/cards/types'

/** Il catalogo, indicizzato per id: le altre risposte (collezione, mazzo, partita) citano le carte per id. */
export interface Catalog {
  cards: CardDefinition[]
  byId: ReadonlyMap<number, CardDefinition>
}

/**
 * Richiesta del catalogo. Cambia solo quando escono carte nuove: si scarica una volta per
 * sessione e resta in memoria (contratto API §4.1).
 */
export const catalogQuery = queryOptions({
  queryKey: ['cards', 'catalog'],
  queryFn: async ({ signal }): Promise<Catalog> => {
    const cards = await fetchCatalog(signal)
    return { cards, byId: new Map(cards.map((card) => [card.id, card])) }
  },
  staleTime: Infinity,
  gcTime: Infinity,
})

/**
 * Catalogo delle carte, già pronto (la pagina che lo usa aspetta con la Suspense).
 *
 * @returns Le carte e la loro mappa per id.
 */
export function useCatalog(): Catalog {
  return useSuspenseQuery(catalogQuery).data
}
