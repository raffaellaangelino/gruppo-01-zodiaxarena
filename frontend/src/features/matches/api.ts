import { BACKEND_READY, USE_MOCKS } from '@/config/env'
import { request } from '@/lib/http'
import { matchMock } from '@/mocks/match'
import { mockResponse } from '@/mocks/mockResponse'
import { toMatch, type MatchDto } from '@/features/matches/dto'
import type { Match } from '@/features/matches/types'

/**
 * Una partita giocata, con tutti gli eventi: `GET /api/matches/{id}` (contratto API §8.2).
 * Finché il backend non ha l'endpoint (`BACKEND_READY.match`), risponde con la partita di esempio.
 *
 * @param id Partita.
 * @param signal Per annullare la richiesta.
 * @returns La partita, dal punto di vista di chi guarda.
 * @throws {import('@/lib/http').ApiError} 404 se non esiste o è di altri giocatori.
 */
export async function fetchMatch(id: number, signal?: AbortSignal): Promise<Match> {
  const dto =
    USE_MOCKS || !BACKEND_READY.match
      ? await mockResponse(matchMock(id), signal)
      : await request<MatchDto>(`/matches/${id}`, { signal })
  return toMatch(dto)
}
