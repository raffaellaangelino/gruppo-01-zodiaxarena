import type { PlayerSummary } from '@/features/player/types'

/** Giocatore di esempio, lo stesso delle tavole (Lyra, Fazione Efesto). */
export const playerSummaryMock: PlayerSummary = {
  nickname: 'Lyra',
  credits: 340,
  faction: { god: 'Efesto', element: 'fuoco', effect: '+2 ATK al Fuoco' },
  unreadNotifications: 1,
  pending: { challenges: 2, trades: 1 },
}
