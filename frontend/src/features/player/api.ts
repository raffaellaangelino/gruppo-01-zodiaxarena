import { USE_MOCKS } from '@/config/env'
import { request } from '@/lib/http'
import { mockResponse } from '@/mocks/mockResponse'
import { playerSummaryMock } from '@/mocks/player'
import { toPlayerSummary, type PlayerDto } from '@/features/player/dto'
import type { PlayerSummary } from '@/features/player/types'

/**
 * Riepilogo del giocatore per la barra di gioco: `GET /api/players/me`
 * (contratto API §3.1). Con i dati di esempio attivi risponde con quelli.
 *
 * @param signal Per annullare la richiesta.
 * @returns Nickname, segno, crediti, Fazione, notifiche, cose da fare e primi passi.
 */
export async function fetchPlayerSummary(signal?: AbortSignal): Promise<PlayerSummary> {
  if (USE_MOCKS) return mockResponse(playerSummaryMock(), signal)
  return toPlayerSummary(await request<PlayerDto>('/players/me', { signal }))
}
