import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { BACKEND_READY, USE_MOCKS } from '@/config/env'
import { fetchMatch } from '@/features/matches/api'
import type { Match } from '@/features/matches/types'

/**
 * Richiesta di una partita. Una partita giocata non cambia più: si scarica una volta.
 *
 * @param id Partita.
 * @returns Le opzioni della richiesta.
 */
export const matchQuery = (id: number) =>
  queryOptions({
    queryKey: ['matches', id],
    queryFn: ({ signal }) => fetchMatch(id, signal),
    staleTime: Infinity,
  })

/**
 * Una partita, già pronta (la pagina aspetta con la Suspense).
 *
 * @param id Partita.
 * @returns La partita.
 */
export function useMatch(id: number): Match {
  return useSuspenseQuery(matchQuery(id)).data
}

/** La partita mostrata è quella di esempio (dati finti o endpoint ancora assente): va detto. */
export const MATCH_IS_SAMPLE = USE_MOCKS || !BACKEND_READY.match
