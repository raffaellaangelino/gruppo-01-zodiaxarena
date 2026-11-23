import { shouldUseMocks } from '@/config/env'
import { request } from '@/lib/http'
import { mockResponse } from '@/mocks/mockResponse'
import { playersSearchMock } from '@/mocks/players'
import type { PlayerSearchResult } from '@/features/players/types'

/** Risposta di `GET /api/players/search` (forma proposta al backend, contratto API §10.1). */
export interface PlayerSearchDto {
  items: { id: number; nickname: string; pendingChallengeId: number | null }[]
}

/** Lettere minime prima di cercare (contratto §10.1: "dal 3° carattere"). */
export const PLAYER_SEARCH_MIN_LENGTH = 3

/**
 * Cerca giocatori per nickname (senza distinguere maiuscole e minuscole, escluso chi cerca):
 * `GET /api/players/search?q=`. Va chiamata solo se l'endpoint esiste (`BACKEND_READY.playerSearch`)
 * o con i dati di esempio.
 *
 * @param query Testo scritto, almeno {@link PLAYER_SEARCH_MIN_LENGTH} caratteri.
 * @param signal Per annullare (ogni lettera nuova annulla la ricerca precedente).
 * @returns I giocatori trovati.
 */
export async function searchPlayers(
  query: string,
  signal?: AbortSignal,
): Promise<PlayerSearchResult[]> {
  const params = new URLSearchParams({ q: query })
  const { items } = shouldUseMocks()
    ? await mockResponse(playersSearchMock(query), signal)
    : await request<PlayerSearchDto>(`/players/search?${params}`, { signal })
  return items.map(({ id, nickname, pendingChallengeId }) => ({
    player: { id, nickname, faction: null, faced: false },
    pendingChallengeId,
  }))
}
