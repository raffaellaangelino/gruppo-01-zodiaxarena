import ascendente from '@/assets/cards/ascendente.webp'
import giove from '@/assets/cards/giove.webp'
import luna from '@/assets/cards/luna.webp'
import marte from '@/assets/cards/marte.webp'
import mercurio from '@/assets/cards/mercurio.webp'
import saturno from '@/assets/cards/saturno.webp'
import sole from '@/assets/cards/sole.webp'
import venere from '@/assets/cards/venere.webp'
import type { PlayerRef } from '@/domain/game'
import type { HomeSummary } from '@/features/home/types'
import { daysFromNow } from '@/mocks/time'

/** Avversari di esempio: Maia non è ancora stata affrontata (iniziale), Orione sì. */
const MAIA: PlayerRef = { id: 42, nickname: 'Maia', faction: null, faced: false }
const ORIONE: PlayerRef = {
  id: 43,
  nickname: 'Orione',
  faction: { god: 'POSEIDONE', element: 'WATER' },
  faced: true,
}

/** Home di esempio, con gli stessi dati della tavola Home scenica. */
export function homeSummaryMock(): HomeSummary {
  return {
    rewardedChallenges: { done: 2, total: 5 },
    waiting: [
      { kind: 'CHALLENGE_RECEIVED', id: 31, from: MAIA, receivedAt: daysFromNow(0) },
      { kind: 'REPLAY_UNSEEN', id: 88, opponent: ORIONE },
      {
        kind: 'TRADE_RECEIVED',
        id: 12,
        from: MAIA,
        cardsOffered: 2,
        cardsRequested: 1,
        expiresAt: daysFromNow(7),
      },
    ],
    deck: {
      name: 'Cielo di Fuoco',
      valid: true,
      cards: [
        { id: 5, code: 'SOLE-LEONE-I', imageUrl: sole },
        { id: 25, code: 'MARTE-ARIETE-I', imageUrl: marte },
        { id: 17, code: 'LUNA-LEONE-I', imageUrl: luna },
        { id: 45, code: 'GIOVE-SAGITTARIO-I', imageUrl: giove },
        { id: 58, code: 'SATURNO-CAPRICORNO-I', imageUrl: saturno },
        { id: 67, code: 'MERCURIO-BILANCIA-I', imageUrl: mercurio },
        { id: 74, code: 'VENERE-TORO-I', imageUrl: venere },
        { id: 101, code: 'ASCENDENTE-LEONE', imageUrl: ascendente },
      ],
    },
    missions: { done: 2, total: 3 },
    packs: { affordable: 3, sunCounter: { done: 6, total: 10 } },
    fullMoon: { nextAt: daysFromNow(17), windowOpen: false },
  }
}
