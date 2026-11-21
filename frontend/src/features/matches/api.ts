import { BACKEND_READY, USE_MOCKS } from '@/config/env'
import { ApiError, request } from '@/lib/http'
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
 * @returns La partita, dal punto di vista di chi guarda; `null` se non esiste o è di altri
 *   giocatori (404): non è un errore da riprovare, la pagina lo dice e riporta alle sfide.
 * @throws {ApiError} Per gli altri errori (rete, server).
 */
export async function fetchMatch(id: number, signal?: AbortSignal): Promise<Match | null> {
  if (USE_MOCKS || !BACKEND_READY.match) return toMatch(await mockResponse(matchMock(id), signal))
  try {
    return toMatch(await request<MatchDto>(`/matches/${id}`, { signal }))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

/**
 * Segna la partita come vista da chi guarda: `POST /api/matches/{id}/seen` (contratto API §8.4).
 * Così la sfida giocata esce da "Da giocare" e il contatore della barra scende.
 * Con i dati di esempio non fa nulla.
 *
 * @param id Partita.
 * @throws {import('@/lib/http').ApiError} 404 se non esiste o è di altri giocatori.
 */
export async function markMatchSeen(id: number): Promise<void> {
  if (USE_MOCKS || !BACKEND_READY.match) return
  await request<void>(`/matches/${id}/seen`, { method: 'POST' })
}
