import type { CardThumb, Progress } from '@/domain/game'

/** Una cosa che aspetta il giocatore ("Ti aspettano"): ognuna ha la sua azione. */
export type WaitingItem =
  | {
      kind: 'challenge-received'
      id: string
      /** Nickname di chi ha sfidato. */
      from: string
      /** Quando è arrivata, già in parole (es. "ricevuta oggi"). */
      receivedLabel: string
    }
  | {
      kind: 'replay'
      id: string
      /** Nickname dell'avversario. */
      opponent: string
    }
  | {
      kind: 'trade-received'
      id: string
      /** Nickname di chi propone lo scambio. */
      from: string
      /** Carte che riceveresti. */
      cardsOffered: number
      /** Carte che daresti. */
      cardsRequested: number
      /** Giorni prima che la proposta scada. */
      expiresInDays: number
    }

/** Il Cielo (mazzo) attivo, come appare nella Banda. */
export interface ActiveDeck {
  name: string
  /** Vero se il mazzo rispetta i vincoli del regolamento e si può usare in sfida. */
  valid: boolean
  /** Le carte del mazzo, nell'ordine degli slot. */
  cards: CardThumb[]
}

/** Tutto ciò che serve alla Home, oltre al riepilogo del giocatore. */
export interface HomeSummary {
  /** Sfide premiate oggi: le prime 5 del giorno danno ricompense. */
  rewardedChallenges: Progress
  /** "Ti aspettano": sfide ricevute, replay da guardare, scambi ricevuti. */
  waiting: WaitingItem[]
  deck: ActiveDeck
  /** Missioni del giorno. */
  missions: Progress
  packs: {
    /** Pacchetti che si possono aprire con i crediti attuali. */
    affordable: number
    /** Contatore del Sole: pacchetti aperti dall'ultimo Sole, su quanti ne garantiscono uno. */
    sunCounter: Progress
  }
  /** Giorni alla prossima luna piena (cambio di Fazione). */
  daysToFullMoon: number
}
