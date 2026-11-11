import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { fetchPlayerSummary } from '@/features/player/api'

/**
 * Richiesta del riepilogo del giocatore: chiave della cache e funzione, in un posto solo.
 * La usano sia il caricamento iniziale (`BootGate`) sia le pagine.
 */
export const playerSummaryQuery = queryOptions({
  queryKey: ['player', 'summary'],
  queryFn: ({ signal }) => fetchPlayerSummary(signal),
})

/**
 * Riepilogo del giocatore (crediti, Fazione, contatori), già pronto: lo carica `BootGate`
 * prima di mostrare le pagine, quindi qui non c'è mai uno stato "in arrivo".
 *
 * @returns Il riepilogo.
 */
export function usePlayerSummary() {
  return useSuspenseQuery(playerSummaryQuery).data
}
