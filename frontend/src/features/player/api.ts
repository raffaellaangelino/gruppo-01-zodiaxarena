import { USE_MOCKS } from '@/config/env'
import { apiNotAvailable } from '@/lib/http'
import { mockResponse } from '@/mocks/mockResponse'
import { playerSummaryMock } from '@/mocks/player'
import type { PlayerSummary } from '@/features/player/types'

/**
 * Riepilogo del giocatore per la barra di gioco.
 *
 * Il backend non ha ancora l'endpoint: con i dati di esempio attivi risponde con quelli.
 * Quando arriva, qui si sostituisce `apiNotAvailable` con `request()` e nient'altro cambia.
 *
 * @param signal Per annullare la richiesta.
 * @returns Nickname, crediti, Fazione, notifiche e cose da fare.
 */
export async function fetchPlayerSummary(signal?: AbortSignal): Promise<PlayerSummary> {
  if (USE_MOCKS) return mockResponse(playerSummaryMock, signal)
  return apiNotAvailable('riepilogo del giocatore')
}
