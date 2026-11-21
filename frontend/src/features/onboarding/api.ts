import { request } from '@/lib/http'
import type { GodCode } from '@/domain/game'
import { toPlayerSummary, type PlayerDto } from '@/features/player/dto'
import type { PlayerSummary } from '@/features/player/types'

/**
 * Prima scelta della Fazione, al primo passo con Ermes: `PUT /api/players/me/faction`.
 * Chiude il passo `FACTION` dei primi passi.
 *
 * @param god Il Dio scelto.
 * @returns Il giocatore aggiornato, già nella forma dell'interfaccia.
 * @throws {import('@/lib/http').ApiError} 409 se la Fazione era già stata scelta, 0 se il server
 *   non risponde.
 */
export async function chooseInitialFaction(god: GodCode): Promise<PlayerSummary> {
  const dto = await request<PlayerDto>('/players/me/faction', { method: 'PUT', body: { god } })
  return toPlayerSummary(dto)
}
