import { queryOptions, useSuspenseQuery, type QueryClient } from '@tanstack/react-query'
import { fetchChallenges } from '@/features/challenges/api'
import type { Challenge, ChallengeBox } from '@/features/challenges/types'
import { playerSummaryQuery } from '@/features/player/queries'

/** Ogni quanto si riguardano le liste mentre la pagina è aperta (finché non arrivano gli eventi in tempo reale). */
const REFRESH_MS = 30_000

/** Chiave comune delle sfide: basta invalidarla per riscaricare entrambe le liste. */
export const CHALLENGES_KEY = ['challenges'] as const

/**
 * Riscarica tutto quello che dipende dalle sfide: le due liste e il riepilogo del giocatore, da
 * cui la barra legge il contatore delle sfide da giocare. Da chiamare dopo ogni azione su una
 * sfida (lancio, rifiuto, ritiro, accettazione, partita vista).
 *
 * @param queryClient Cache delle richieste.
 * @returns Quando i dati sono di nuovo aggiornati.
 */
export async function refreshChallenges(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY }),
    queryClient.invalidateQueries({ queryKey: playerSummaryQuery.queryKey }),
  ])
}

/**
 * Richiesta di una lista di sfide.
 *
 * @param box `TO_PLAY` (da giocare) o `SENT` (inviate).
 * @returns Le opzioni della richiesta.
 */
export const challengesQuery = (box: ChallengeBox) =>
  queryOptions({
    queryKey: [...CHALLENGES_KEY, box],
    queryFn: ({ signal }) => fetchChallenges(box, signal),
    refetchInterval: REFRESH_MS,
  })

/**
 * Una lista di sfide, già pronta (la pagina aspetta con la Suspense del guscio).
 *
 * @param box Quale lista.
 * @returns Le sfide.
 */
export function useChallenges(box: ChallengeBox): Challenge[] {
  return useSuspenseQuery(challengesQuery(box)).data
}
