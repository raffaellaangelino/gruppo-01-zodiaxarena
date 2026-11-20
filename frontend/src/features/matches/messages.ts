import type { MatchOutcome } from '@/features/matches/types'

/** Testi del Rotolo (cronaca) e del Verdetto (tavole Sfide-Rotolo, Sfide-Verdetto, Sconfitta, Pareggio). */
export const MATCH_COPY = {
  back: 'Torna alle sfide',
  skip: 'Salta al risultato',
  replay: 'Riguarda il Rotolo',
  chronicleTitle: 'Il Rotolo di Lachesi',
  /** @param me Chi guarda. @param opponent Avversario. */
  chronicleSubtitle: (me: string, opponent: string) => `${me} contro ${opponent}, round per round.`,
  round: 'Round',
  startHp: 'PV a inizio round',
  end: 'Il filo è finito: guarda come è andata.',
  toVerdict: 'Vai al Verdetto',
  moments: {
    WIN: 'Cosa ha deciso la partita',
    LOSS: 'Cosa puoi cambiare',
    DRAW: 'Il filo della partita',
  } satisfies Record<MatchOutcome, string>,
  rematch: 'Rivincita',
  editSky: 'Modifica il Cielo',
  outcome: {
    WIN: { word: 'Vittoria', phrase: '«Il filo è tagliato. Il cielo, per stanotte, è tuo.»' },
    LOSS: { word: 'Sconfitta', phrase: '«Ogni filo si riannoda: il cielo resta da contendere.»' },
    DRAW: { word: 'Pareggio', phrase: '«Due fili della stessa lunghezza. Li taglio insieme.»' },
  } satisfies Record<MatchOutcome, { word: string; phrase: string }>,
  atropo: 'Atropo',
} as const
