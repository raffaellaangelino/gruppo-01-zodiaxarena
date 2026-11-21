import { useQuery, useQueryClient } from '@tanstack/react-query'
import { BACKEND_READY, USE_MOCKS } from '@/config/env'
import { catalogQuery } from '@/features/cards/queries'
import { fetchDeck } from '@/features/decks/api'
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
    enabled: deckId !== null && (USE_MOCKS || BACKEND_READY.myDeck),
  })
  return {
    deck: query.data ?? null,
    deckId,
    loading: query.isPending && query.fetchStatus !== 'idle',
    failed: query.isError,
  }
}
