import { USE_MOCKS } from '@/config/env'
import { request } from '@/lib/http'
import { challengesMock } from '@/mocks/challenges'
import { mockResponse } from '@/mocks/mockResponse'
import { toChallenge, type ChallengeListDto } from '@/features/challenges/dto'
import type { Challenge, ChallengeBox } from '@/features/challenges/types'

/**
 * Le mie sfide: `GET /api/challenges/me?box=TO_PLAY|SENT` (contratto API §7.1).
 * `TO_PLAY`: ricevute in attesa e giocate non ancora viste · `SENT`: inviate, anche chiuse.
 *
 * @param box Quale lista.
 * @param signal Per annullare la richiesta.
 * @returns Le sfide, dalla più recente.
 */
export async function fetchChallenges(
  box: ChallengeBox,
  signal?: AbortSignal,
): Promise<Challenge[]> {
  const { items } = USE_MOCKS
    ? await mockResponse(challengesMock(box), signal)
    : await request<ChallengeListDto>(`/challenges/me?box=${box}`, { signal })
  return items.map(toChallenge)
}

/**
 * Rifiuta una sfida ricevuta: `POST /api/challenges/{id}/decline` (§7.5).
 *
 * @param id Sfida.
 * @throws {import('@/lib/http').ApiError} 409 `CHALLENGE_NOT_PENDING` se non è più in attesa.
 */
export async function declineChallenge(id: number): Promise<void> {
  if (USE_MOCKS) return mockResponse(undefined)
  await request<void>(`/challenges/${id}/decline`, { method: 'POST' })
}

/**
 * Ritira una sfida inviata: `POST /api/challenges/{id}/withdraw` (§7.5).
 *
 * @param id Sfida.
 * @throws {import('@/lib/http').ApiError} 409 `CHALLENGE_NOT_PENDING` se non è più in attesa.
 */
export async function withdrawChallenge(id: number): Promise<void> {
  if (USE_MOCKS) return mockResponse(undefined)
  await request<void>(`/challenges/${id}/withdraw`, { method: 'POST' })
}

/**
 * Lancia una sfida: `POST /api/challenges` (contratto API §7.2). Il server controlla il mazzo e ne
 * salva una copia, insieme alla Fazione, al momento dell'invio.
 *
 * @param opponentId Avversario.
 * @param deckId Mazzo con cui sfidi.
 * @returns L'id della sfida creata.
 * @throws {import('@/lib/http').ApiError} 409 `CHALLENGE_ALREADY_PENDING` o `CANNOT_CHALLENGE_SELF`,
 *   422 `DECK_INVALID`, 404 se l'avversario non esiste, 0 se il server non risponde.
 */
export async function createChallenge(opponentId: number, deckId: number): Promise<number> {
  if (USE_MOCKS) return mockResponse(99)
  const { challengeId } = await request<{ challengeId: number }>('/challenges', {
    method: 'POST',
    body: { opponentId, deckId },
  })
  return challengeId
}

/**
 * Accetta una sfida e la gioca: `POST /api/challenges/{id}/accept` (contratto API §7.3). Il server
 * copia il tuo mazzo, chiama l'engine e risponde solo a partita pronta.
 *
 * @param challengeId Sfida ricevuta.
 * @param deckId Mazzo con cui rispondi.
 * @returns L'id della partita.
 * @throws {import('@/lib/http').ApiError} 409 `CHALLENGE_NOT_PENDING`, 422 `DECK_INVALID`,
 *   503/502 se l'engine non risponde (la sfida resta in attesa), 404, 0 se il server non risponde.
 */
export async function acceptChallenge(challengeId: number, deckId: number): Promise<number> {
  if (USE_MOCKS) return mockResponse(88)
  const { matchId } = await request<{ matchId: number }>(`/challenges/${challengeId}/accept`, {
    method: 'POST',
    body: { deckId },
  })
  return matchId
}
