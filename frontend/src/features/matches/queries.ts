import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BACKEND_READY, shouldUseMocks } from '@/config/env'
import { refreshChallenges } from '@/features/challenges/queries'
import { fetchMatch, markMatchSeen } from '@/features/matches/api'
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
 * @returns La partita, o `null` se non esiste o è di altri giocatori.
 */
export function useMatch(id: number): Match | null {
  return useSuspenseQuery(matchQuery(id)).data
}

/**
 * Segna la partita come vista una volta aperta, poi riscarica le sfide e il riepilogo del
 * giocatore (lista "Da giocare" e contatore della barra). Se la chiamata fallisce non si mostra
 * nulla: il Rotolo resta leggibile e la sfida si segnerà alla prossima apertura.
 *
 * @param id Partita aperta.
 */
export function useMarkMatchSeen(id: number): void {
  const queryClient = useQueryClient()
  useEffect(() => {
    markMatchSeen(id)
      .then(() => refreshChallenges(queryClient))
      .catch(() => undefined)
  }, [id, queryClient])
}

/** La partita mostrata è quella di esempio (dati finti o endpoint ancora assente): va detto. */
export const MATCH_IS_SAMPLE = shouldUseMocks() || !BACKEND_READY.match
