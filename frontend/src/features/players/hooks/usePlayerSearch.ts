import { useQuery } from '@tanstack/react-query'
import { BACKEND_READY, USE_MOCKS } from '@/config/env'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { PLAYER_SEARCH_MIN_LENGTH, searchPlayers } from '@/features/players/api'

/** Pausa nella scrittura prima di cercare (ms). */
const SEARCH_DELAY_MS = 300

/** La ricerca si può usare: c'è l'endpoint, oppure si lavora con i dati di esempio. */
export const PLAYER_SEARCH_AVAILABLE = USE_MOCKS || BACKEND_READY.playerSearch

/**
 * Ricerca dei giocatori mentre si scrive: parte dal 3° carattere e quando la scrittura si ferma.
 *
 * @param query Testo scritto nel campo.
 * @returns I risultati (vuoti finché non si cerca), se la ricerca è in corso e se è fallita.
 */
export function usePlayerSearch(query: string) {
  const trimmed = query.trim()
  const settled = useDebouncedValue(trimmed, SEARCH_DELAY_MS)
  const enabled = PLAYER_SEARCH_AVAILABLE && settled.length >= PLAYER_SEARCH_MIN_LENGTH
  const result = useQuery({
    queryKey: ['players', 'search', settled.toLowerCase()],
    queryFn: ({ signal }) => searchPlayers(settled, signal),
    enabled,
    staleTime: 30_000,
  })
  return {
    results: enabled ? (result.data ?? []) : [],
    /** Il testo è abbastanza lungo per cercare. */
    active: trimmed.length >= PLAYER_SEARCH_MIN_LENGTH,
    searching: trimmed !== settled || (enabled && result.isPending),
    failed: enabled && result.isError,
  }
}
