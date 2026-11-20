import type { ChallengeBox } from '@/features/challenges/types'
import type { ChallengeListDto } from '@/features/challenges/dto'
import { daysFromNow } from '@/mocks/time'

/** Sfide di esempio, le stesse delle tavole Sfide e Sfide-Inviate. */
export function challengesMock(box: ChallengeBox): ChallengeListDto {
  const base = { expiresAt: null, rewarded: false, matchId: null, cancelReason: null }
  if (box === 'TO_PLAY') {
    return {
      items: [
        {
          ...base,
          id: 31,
          status: 'PENDING',
          direction: 'RECEIVED',
          opponent: { id: 42, nickname: 'Maia' },
          createdAt: daysFromNow(0),
        },
        {
          ...base,
          id: 30,
          status: 'PLAYED',
          direction: 'RECEIVED',
          opponent: { id: 43, nickname: 'Orione' },
          createdAt: daysFromNow(-1),
          matchId: 88,
        },
      ],
    }
  }
  return {
    items: [
      {
        ...base,
        id: 35,
        status: 'PENDING',
        direction: 'SENT',
        opponent: { id: 44, nickname: 'Vega' },
        createdAt: daysFromNow(-2),
      },
      {
        ...base,
        id: 36,
        status: 'PENDING',
        direction: 'SENT',
        opponent: { id: 45, nickname: 'Altair' },
        createdAt: daysFromNow(0),
      },
      {
        ...base,
        id: 27,
        status: 'DECLINED',
        direction: 'SENT',
        opponent: { id: 46, nickname: 'Sirio' },
        createdAt: daysFromNow(-12),
        cancelReason: 'DECLINED',
      },
      {
        ...base,
        id: 22,
        status: 'EXPIRED',
        direction: 'SENT',
        opponent: { id: 42, nickname: 'Maia' },
        createdAt: daysFromNow(-17),
        cancelReason: 'EXPIRED',
      },
      {
        ...base,
        id: 20,
        status: 'CANCELLED',
        direction: 'SENT',
        opponent: { id: 43, nickname: 'Orione' },
        createdAt: daysFromNow(-19),
        cancelReason: 'DECK_CHANGED',
      },
    ],
  }
}
