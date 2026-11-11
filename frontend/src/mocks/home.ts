import ascendente from '@/assets/cards/ascendente.webp'
import giove from '@/assets/cards/giove.webp'
import luna from '@/assets/cards/luna.webp'
import marte from '@/assets/cards/marte.webp'
import mercurio from '@/assets/cards/mercurio.webp'
import saturno from '@/assets/cards/saturno.webp'
import sole from '@/assets/cards/sole.webp'
import venere from '@/assets/cards/venere.webp'
import type { HomeSummary } from '@/features/home/types'

/** Home di esempio, con gli stessi dati della tavola Home scenica. */
export const homeSummaryMock: HomeSummary = {
  rewardedChallenges: { done: 2, total: 5 },
  waiting: [
    { kind: 'challenge-received', id: 's-1', from: 'Maia', receivedLabel: 'ricevuta oggi' },
    { kind: 'replay', id: 'r-1', opponent: 'Orione' },
    {
      kind: 'trade-received',
      id: 't-1',
      from: 'Maia',
      cardsOffered: 2,
      cardsRequested: 1,
      expiresInDays: 7,
    },
  ],
  deck: {
    name: 'Cielo di Fuoco',
    valid: true,
    cards: [
      { id: 'sole', name: 'Sole', imageUrl: sole },
      { id: 'marte', name: 'Marte', imageUrl: marte },
      { id: 'luna', name: 'Luna', imageUrl: luna },
      { id: 'giove', name: 'Giove', imageUrl: giove },
      { id: 'saturno', name: 'Saturno', imageUrl: saturno },
      { id: 'mercurio', name: 'Mercurio', imageUrl: mercurio },
      { id: 'venere', name: 'Venere', imageUrl: venere },
      { id: 'ascendente', name: 'Ascendente', imageUrl: ascendente },
    ],
  },
  missions: { done: 2, total: 3 },
  packs: { affordable: 3, sunCounter: { done: 6, total: 10 } },
  daysToFullMoon: 17,
}
