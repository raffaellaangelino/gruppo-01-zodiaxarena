import type { ProfileStats } from '@/features/player/profileTypes'

export function profileStatsMock(): ProfileStats {
  return {
    wins: 18,
    losses: 7,
    tradesCompleted: 4,
    friends: 3,
  }
}
