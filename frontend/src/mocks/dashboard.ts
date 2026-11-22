import type { DashboardSummary } from '@/features/home/dashboardTypes'
import { daysFromNow } from '@/mocks/time'

export function dashboardSummaryMock(): DashboardSummary {
  return {
    credits: 340,
    faction: 'EFESTO',
    nextFullMoon: daysFromNow(17),
    moonWindowOpen: false,
    missions: [
      {
        id: 1,
        title: 'Lancia due sfide',
        description: 'Sfida due Astromanti',
        done: 1,
        total: 2,
        reward: 40,
      },
      {
        id: 2,
        title: 'Apri tre carte',
        description: 'Apri pacchetti o ottieni carte',
        done: 2,
        total: 3,
        reward: 35,
      },
      {
        id: 3,
        title: 'Vinci un round',
        description: 'Concludi un round con la vittoria',
        done: 0,
        total: 1,
        reward: 25,
      },
    ],
    challenges: [{ id: 31, nickname: 'Maia', receivedAt: daysFromNow(0) }],
    trades: [
      {
        id: 12,
        nickname: 'Maia',
        offeredCards: 2,
        requestedCards: 1,
        expiresAt: daysFromNow(7),
      },
    ],
    lastMatch: {
      id: 4242,
      outcome: 'WIN',
      opponent: 'Orione',
      playedAt: daysFromNow(1),
      rounds: 3,
    },
  }
}
