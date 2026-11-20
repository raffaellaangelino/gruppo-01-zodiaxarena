import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { PATHS } from '@/app/paths'
import { ApiError } from '@/lib/http'
import { chooseInitialFaction } from '@/features/onboarding/api'
import { playerSummaryQuery } from '@/features/player/queries'

/** Perché la scelta non è riuscita. */
export type FactionFailure = 'network' | 'server'

/**
 * Salva la prima Fazione e porta alla Home.
 *
 * - Riuscita: il riepilogo del giocatore in memoria si aggiorna con la risposta (barra e Home
 *   mostrano subito il Dio scelto, senza un nuovo caricamento).
 * - 409, Fazione già scelta (per esempio da un'altra scheda): non è un errore per il giocatore;
 *   si ricarica il riepilogo e si va alla Home.
 *
 * @returns La funzione per scegliere, lo stato dell'invio e il motivo di un errore.
 */
export function useChooseFaction() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: chooseInitialFaction,
    onSuccess: (player) => {
      queryClient.setQueryData(playerSummaryQuery.queryKey, player)
      void navigate(PATHS.home, { replace: true })
    },
    onError: async (error) => {
      if (error instanceof ApiError && error.status === 409) {
        await queryClient.invalidateQueries({ queryKey: playerSummaryQuery.queryKey })
        void navigate(PATHS.home, { replace: true })
      }
    },
  })

  const error = mutation.error
  const failure: FactionFailure | null =
    !error || (error instanceof ApiError && error.status === 409)
      ? null
      : error instanceof ApiError && error.isNetworkError
        ? 'network'
        : 'server'

  return { choose: mutation.mutate, saving: mutation.isPending, failure }
}
