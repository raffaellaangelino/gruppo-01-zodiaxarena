import type { Element, GodCode } from '@/domain/game'
import type { SignCode } from '@/domain/game'

export interface FriendProfile {
  id: number
  nickname: string
  faction: GodCode
  element: Element
  sign: SignCode
  wins: number
  losses: number
  showcaseCardIds: number[]
}

export const PROFILE_FRIENDS: readonly FriendProfile[] = [
  {
    id: 42,
    nickname: 'Maia',
    faction: 'POSEIDONE',
    element: 'WATER',
    sign: 'CANCRO',
    wins: 12,
    losses: 5,
    showcaseCardIds: [16, 24, 67],
  },
  {
    id: 43,
    nickname: 'Orione',
    faction: 'EFESTO',
    element: 'FIRE',
    sign: 'ARIETE',
    wins: 21,
    losses: 9,
    showcaseCardIds: [1, 25, 45],
  },
  {
    id: 47,
    nickname: 'Andromeda',
    faction: 'DEMETRA',
    element: 'EARTH',
    sign: 'TORO',
    wins: 16,
    losses: 6,
    showcaseCardIds: [2, 58, 74],
  },
]
