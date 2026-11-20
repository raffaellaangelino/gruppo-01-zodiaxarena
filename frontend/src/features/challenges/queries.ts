import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { fetchChallenges } from '@/features/challenges/api'
import type { Challenge, ChallengeBox } from '@/features/challenges/types'

/** Ogni quanto si riguardano le liste mentre la pagina è aperta (finché non arrivano gli eventi in tempo reale). */
const REFRESH_MS = 30_000

/** Chiave comune delle sfide: basta invalidarla per riscaricare entrambe le liste. */
export const CHALLENGES_KEY = ['challenges'] as const

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
