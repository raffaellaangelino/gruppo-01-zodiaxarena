import type { PlayerSummary } from '@/features/player/types'

/** Giocatore di esempio, lo stesso delle tavole (Lyra, Sole in Leone, Fazione Efesto). */
export function playerSummaryMock(): PlayerSummary {
  return {
    id: 7,
    nickname: 'Lyra',
    sign: 'LEONE',
    credits: 340,
    faction: { god: 'EFESTO', element: 'FIRE' },
    deckIds: [1],
    unreadNotifications: 1,
    pending: { challenges: 2, trades: 1, replays: 1 },
    onboarding: { completed: true, currentStep: null },
  }
}
