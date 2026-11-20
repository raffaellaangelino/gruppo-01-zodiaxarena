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
