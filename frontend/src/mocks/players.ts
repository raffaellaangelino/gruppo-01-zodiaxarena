import type { PlayerSearchDto } from '@/features/players/api'

/** Giocatori di esempio, gli stessi delle tavole (Vega e Altair hanno già una sfida in attesa). */
const PLAYERS: PlayerSearchDto['items'] = [
  { id: 46, nickname: 'Sirio', pendingChallengeId: null },
  { id: 44, nickname: 'Vega', pendingChallengeId: 35 },
  { id: 43, nickname: 'Orione', pendingChallengeId: null },
  { id: 45, nickname: 'Altair', pendingChallengeId: 36 },
  { id: 42, nickname: 'Maia', pendingChallengeId: 31 },
  { id: 47, nickname: 'Andromeda', pendingChallengeId: null },
]

/**
 * Ricerca di esempio: i giocatori il cui nickname contiene il testo.
 *
 * @param query Testo cercato.
 * @returns La risposta, nella forma del backend.
 */
export function playersSearchMock(query: string): PlayerSearchDto {
  const q = query.trim().toLowerCase()
  return { items: PLAYERS.filter((p) => p.nickname.toLowerCase().includes(q)) }
}
