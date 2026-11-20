import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { matchPath } from '@/app/paths'
import { ApiError } from '@/lib/http'
import { acceptChallenge } from '@/features/challenges/api'
import { CHALLENGES_KEY } from '@/features/challenges/queries'

/** Perché l'accettazione non è riuscita (tavola Sfide-Stati). */
export type AcceptFailure = 'notPending' | 'deckInvalid' | 'engine' | 'network' | 'server'

/** Tempo minimo dell'attesa: anche se l'engine è velocissimo, "Cloto fila…" si legge. */
const MIN_WAIT_MS = 1600

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Traduce l'errore dell'accettazione nel motivo da mostrare.
 *
 * @param error Errore lanciato da `acceptChallenge`.
 * @returns Il motivo.
 */
function toFailure(error: unknown): AcceptFailure {
  if (!(error instanceof ApiError)) return 'server'
  if (error.isNetworkError) return 'network'
  if (error.status === 409 || error.status === 404) return 'notPending'
  if (error.status === 422 || error.code === 'DECK_INVALID') return 'deckInvalid'
  if ([502, 503, 504].includes(error.status)) return 'engine'
  return 'server'
}

/**
 * Accetta la sfida appena la pagina si apre e, a partita pronta, porta al Rotolo. Parte una sola
 * volta anche se React monta la pagina due volte in sviluppo. In caso di errore la sfida, se era
 * ancora valida, resta in attesa: si può riprovare.
 *
 * @param challengeId Sfida da accettare; `null` se non c'è (la pagina mostra l'errore).
 * @param deckId Mazzo con cui rispondi; `null` se il giocatore non ne ha.
 * @returns Lo stato dell'accettazione, il motivo di un errore e la funzione per riprovare.
 */
export function useAcceptChallenge(challengeId: number | null, deckId: number | null) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const started = useRef(false)

  const mutation = useMutation({
    mutationFn: async ({ id, deck }: { id: number; deck: number }) => {
      const [matchId] = await Promise.all([acceptChallenge(id, deck), wait(MIN_WAIT_MS)])
      return matchId
    },
    onSuccess: (matchId) => {
      void queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY })
      void navigate(matchPath(matchId), { replace: true })
    },
    onError: () => void queryClient.invalidateQueries({ queryKey: CHALLENGES_KEY }),
  })

  const { mutate } = mutation
  useEffect(() => {
    if (started.current || challengeId === null || deckId === null) return
    started.current = true
    mutate({ id: challengeId, deck: deckId })
  }, [challengeId, deckId, mutate])

  return {
    failure: mutation.error ? toFailure(mutation.error) : null,
    retry: () => {
      if (challengeId !== null && deckId !== null) mutate({ id: challengeId, deck: deckId })
    },
  }
}
