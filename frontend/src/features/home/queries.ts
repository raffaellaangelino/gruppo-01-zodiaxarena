import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { fetchHomeSummary } from '@/features/home/api'

/** Richiesta dei dati della Home: la usano il caricamento iniziale e la pagina. */
export const homeSummaryQuery = queryOptions({
  queryKey: ['home', 'summary'],
  queryFn: ({ signal }) => fetchHomeSummary(signal),
})

/**
 * Dati della Home, già pronti (li carica `BootGate` insieme al riepilogo del giocatore).
 *
 * @returns I dati della Home.
 */
export function useHomeSummary() {
  return useSuspenseQuery(homeSummaryQuery).data
}
