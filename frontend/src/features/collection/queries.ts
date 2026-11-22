import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCatalog } from '@/features/cards/queries'
import { fetchCollection } from '@/features/collection/api'
import { toEntries } from '@/features/collection/album'
import type { Collection, CollectionEntry } from '@/features/collection/types'

/** Richiesta della collezione. Cambia quando arrivano carte (pacchetti, scambi): la si riscarica entrando. */
export const collectionQuery = queryOptions({
  queryKey: ['collection'],
  queryFn: ({ signal }) => fetchCollection(signal),
})

/**
 * La collezione, già pronta (la pagina aspetta con la Suspense).
 *
 * @returns La collezione.
 */
export function useCollection(): Collection {
  return useSuspenseQuery(collectionQuery).data
}

/**
 * Tutte le posizioni dell'album: ogni carta del catalogo con quello che il giocatore ne possiede.
 *
 * @returns Le posizioni nell'ordine del catalogo e la collezione.
 */
export function useCollectionEntries(): { entries: CollectionEntry[]; collection: Collection } {
  const { cards } = useCatalog()
  const collection = useCollection()
  const entries = useMemo(() => toEntries(cards, collection), [cards, collection])
  return { entries, collection }
}
