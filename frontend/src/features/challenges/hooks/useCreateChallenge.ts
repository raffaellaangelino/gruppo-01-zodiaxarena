import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { PATHS } from '@/app/paths'
import { ApiError } from '@/lib/http'
import type { PlayerRef } from '@/domain/game'
import { createChallenge } from '@/features/challenges/api'
import { CHALLENGES_KEY } from '@/features/challenges/queries'

/** Perché il lancio non è riuscito. */
export type CreateChallengeFailure =
  'alreadyPending' | 'deckInvalid' | 'notFound' | 'network' | 'server'

/** Stato passato alla scheda Inviate dopo un lancio riuscito, per confermarlo. */
export interface ChallengeLaunchedState {
  launchedTo: string
}

/**
 * Traduce l'errore del lancio nel motivo da mostrare.
 *
 * @param error Errore lanciato da `createChallenge`.
 * @returns Il motivo.
 */
function toFailure(error: unknown): CreateChallengeFailure {
  if (!(error instanceof ApiError)) return 'server'
  if (error.isNetworkError) return 'network'
  if (error.code === 'CHALLENGE_ALREADY_PENDING') return 'alreadyPending'
  if (error.code === 'DECK_INVALID' || error.status === 422) return 'deckInvalid'
  if (error.status === 404) return 'notFound'
  return 'server'
}

/**
 * Lancia una sfida. Se va bene, riscarica le liste e porta alla scheda Inviate, dove la sfida
 * compare "In attesa", con una conferma.
 *
 * @returns La funzione per lanciare, lo stato dell'invio e il motivo di un errore.
 */
export function useCreateChallenge() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const mutation = useMutation({
    mutationFn: ({ opponent, deckId }: { opponent: PlayerRef; deckId: number }) =>
      createChallenge(opponent.id, deckId),
    onSuccess: async (_id, { opponent }) => {
      await queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY })
      const state: ChallengeLaunchedState = { launchedTo: opponent.nickname }
      void navigate(PATHS.challengesSent, { replace: true, state })
    },
  })
  return {
    launch: mutation.mutate,
    launching: mutation.isPending,
    failure: mutation.error ? toFailure(mutation.error) : null,
    reset: mutation.reset,
  }
}
