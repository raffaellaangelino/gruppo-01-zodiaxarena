import { queryOptions, useSuspenseQuery, type QueryClient } from '@tanstack/react-query'
import { BACKEND_READY } from '@/config/env'
import { catalogQuery, useCatalog } from '@/features/cards/queries'
import { challengesQuery, useChallenges } from '@/features/challenges/queries'
import type { DeckDto } from '@/features/decks/dto'
import { fetchDeck } from '@/features/decks/api'
import { DECKS_KEY } from '@/features/decks/queries'
import { fetchHomeSummary } from '@/features/home/api'
import { composeHome } from '@/features/home/compose'
import type { HomeSummary } from '@/features/home/types'
import { playerSummaryQuery, usePlayerSummary } from '@/features/player/queries'

/** Senza `GET /api/home`, la Home si compone dalle API disponibili per l'account corrente. */
const COMPOSED = !BACKEND_READY.home

/** Il mazzo della Home: il primo del giocatore, oppure nessuno. */
const homeDeckQuery = (deckId: number | null) =>
  deckId === null
    ? queryOptions<DeckDto | null>({ queryKey: ['decks', 'none'], queryFn: () => null })
    : queryOptions<DeckDto | null>({
        // Stessa chiave di `deckQuery`: un salvataggio nel Cielo aggiorna anche la Home.
        queryKey: [...DECKS_KEY, 'raw', deckId],
        queryFn: ({ signal }) => fetchDeck(deckId, signal),
      })

/**
 * Prepara in cache quello che serve alla Home composta (sfide, catalogo, mazzo), così all'ingresso
 * la pagina è subito pronta; e ne restituisce la fotografia.
 *
 * @param client Cache delle richieste.
 * @returns I dati della Home in quel momento.
 */
async function warmComposedHome(client: QueryClient): Promise<HomeSummary> {
  const player = await client.ensureQueryData(playerSummaryQuery)
  const [toPlay, catalog, deck] = await Promise.all([
    client.ensureQueryData(challengesQuery('TO_PLAY')),
    client.ensureQueryData(catalogQuery),
    client.ensureQueryData(homeDeckQuery(player.deckIds[0] ?? null)),
  ])
  return composeHome(toPlay, deck, catalog)
}

/** Richiesta dei dati della Home: la usano il caricamento iniziale e la pagina. */
export const homeSummaryQuery = queryOptions({
  queryKey: ['home', 'summary'],
  queryFn: ({ signal, client }) => (COMPOSED ? warmComposedHome(client) : fetchHomeSummary(signal)),
})

/** Home dall'endpoint (o dai dati di esempio). */
function useHomeFromApi(): HomeSummary {
  return useSuspenseQuery(homeSummaryQuery).data
}

/**
 * Home composta: legge sfide e mazzo dalle loro richieste, così si aggiorna con loro (le sfide
 * ogni 30 secondi e dopo ogni azione, il Cielo dopo ogni salvataggio).
 */
function useComposedHome(): HomeSummary {
  const toPlay = useChallenges('TO_PLAY')
  const catalog = useCatalog()
  const deckId = usePlayerSummary().deckIds[0] ?? null
  const deck = useSuspenseQuery(homeDeckQuery(deckId)).data
  return composeHome(toPlay, deck, catalog)
}

/**
 * Dati della Home, già pronti (li carica `BootGate` insieme al riepilogo del giocatore).
 *
 * @returns I dati della Home.
 */
export const useHomeSummary: () => HomeSummary = COMPOSED ? useComposedHome : useHomeFromApi
