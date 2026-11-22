import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/http'
import { declineChallenge, withdrawChallenge } from '@/features/challenges/api'
import { refreshChallenges } from '@/features/challenges/queries'
import type { Challenge } from '@/features/challenges/types'

/** Azione su una sfida in attesa: rifiutare (chi la riceve) o ritirare (chi l'ha inviata). */
export type ChallengeAction = 'decline' | 'withdraw'

/** Esito non riuscito: la sfida non era più in attesa, oppure un problema di rete o del server. */
export type ChallengeActionFailure = 'gone' | 'failed'

const ACTIONS = { decline: declineChallenge, withdraw: withdrawChallenge } as const

/**
 * Rifiuta o ritira una sfida e riscarica le liste e il contatore della barra. Se la sfida non era più in attesa
 * (409, per esempio ritirata dall'altro nel frattempo) le liste si aggiornano lo stesso:
 * la pagina mostra com'è adesso, non com'era.
 *
 * @param action Quale azione.
 * @returns La funzione da chiamare con la sfida, quale sfida è in corso e quale non è riuscita, con il motivo.
 */
export function useChallengeAction(action: ChallengeAction) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (challenge: Challenge) => ACTIONS[action](challenge.id),
    onSettled: () => refreshChallenges(queryClient),
  })

  const error = mutation.error
  const failure: ChallengeActionFailure | null = !error
    ? null
    : error instanceof ApiError && error.status === 409
      ? 'gone'
      : 'failed'

  return {
    run: mutation.mutate,
    /** Id della sfida su cui l'azione è in corso (per disattivare solo il suo pulsante). */
    pendingId: mutation.isPending ? (mutation.variables?.id ?? null) : null,
    /** La sfida su cui l'azione non è riuscita (resta anche se nel frattempo è sparita dalla lista). */
    failed: failure ? (mutation.variables ?? null) : null,
    failure,
  }
}
