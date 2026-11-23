import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { BACKEND_READY, shouldUseMocks } from '@/config/env'
import { catalogQuery } from '@/features/cards/queries'
import { fetchDeck, saveDeck, type DeckSaveBody } from '@/features/decks/api'
import type { DeckDto } from '@/features/decks/dto'
import { playerSummaryQuery } from '@/features/player/queries'
import { toDeck } from '@/features/decks/dto'
import type { Deck } from '@/features/decks/types'
import { usePlayerSummary } from '@/features/player/queries'

/** Chiave della cache dei mazzi: dopo un salvataggio si invalida tutto da qui. */
export const DECKS_KEY = ['decks'] as const

/** Stato del Cielo in uso. */
export interface MyDeckState {
  /** Il Cielo; `null` finché arriva, se non c'è o se non si è potuto leggere. */
  deck: Deck | null
  /** Il giocatore ha un mazzo: si può sfidare e accettare anche prima che arrivino le carte. */
  deckId: number | null
  loading: boolean
  failed: boolean
}

/**
 * Il Cielo con cui giochi le sfide, con le carte del catalogo. Per il SAL è il primo mazzo del
 * giocatore (`deckIds` di `/players/me`): la scelta tra più Cieli arriva con la pagina Il tuo Cielo.
 *
 * Non sospende la pagina: le carte sono un'informazione in più, quindi se tardano o non arrivano
 * sfidare e accettare funzionano lo stesso.
 *
 * @returns Il Cielo, il suo id e lo stato della richiesta.
 */
export function useMyDeck(): MyDeckState {
  const queryClient = useQueryClient()
  const deckId = usePlayerSummary().deckIds[0] ?? null
  const query = useQuery({
    queryKey: [...DECKS_KEY, deckId],
    queryFn: async ({ signal }) => {
      const [catalog, dto] = await Promise.all([
        queryClient.ensureQueryData(catalogQuery),
        fetchDeck(deckId as number, signal),
      ])
      return toDeck(dto, catalog)
    },
    enabled: deckId !== null && (shouldUseMocks() || BACKEND_READY.myDeck),
  })
  return {
    deck: query.data ?? null,
    deckId,
    loading: query.isPending && query.fetchStatus !== 'idle',
    failed: query.isError,
  }
}

/**
 * Richiesta di un mazzo così come lo manda il backend, per comporlo (caselle e conteggi).
 *
 * @param id Mazzo.
 * @returns Le opzioni della richiesta.
 */
export const deckQuery = (id: number) =>
  queryOptions({
    queryKey: [...DECKS_KEY, 'raw', id],
    queryFn: ({ signal }) => fetchDeck(id, signal),
  })

/**
 * Il mazzo da comporre, già pronto (la pagina aspetta con la Suspense).
 *
 * @param id Mazzo.
 * @returns Il mazzo come lo manda il backend.
 */
export function useDeckToEdit(id: number): DeckDto {
  return useSuspenseQuery(deckQuery(id)).data
}

/**
 * Salva un Cielo e poi riscarica quello che ne dipende: i mazzi (anche quello delle sfide), la
 * collezione (le carte "nel Cielo") e il giocatore.
 *
 * @param id Mazzo.
 * @returns La mutazione.
 */
export function useSaveDeck(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: DeckSaveBody) => saveDeck(id, body),
    onSuccess: async (saved) => {
      queryClient.setQueryData(deckQuery(id).queryKey, saved)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: DECKS_KEY }),
        queryClient.invalidateQueries({ queryKey: ['collection'] }),
        queryClient.invalidateQueries({ queryKey: playerSummaryQuery.queryKey }),
      ])
    },
  })
}
