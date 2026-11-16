import type { CardThumb, PlayerRef, Progress } from '@/domain/game'

/** Una cosa che aspetta il giocatore ("Ti aspettano"): ognuna ha la sua azione. */
export type WaitingItem =
  | {
      kind: 'CHALLENGE_RECEIVED'
      /** Id della sfida. */
      id: number
      from: PlayerRef
      receivedAt: string
    }
  | {
      kind: 'REPLAY_UNSEEN'
      /** Id della partita. */
      id: number
      opponent: PlayerRef
    }
  | {
      kind: 'TRADE_RECEIVED'
      /** Id dello scambio. */
      id: number
      from: PlayerRef
      /** Carte che riceveresti. */
      cardsOffered: number
      /** Carte che daresti. */
      cardsRequested: number
      expiresAt: string
    }

/** Il Cielo (mazzo) attivo, come appare nella Banda. */
export interface ActiveDeck {
  name: string
  /** Vero se rispetta i vincoli del regolamento e si può usare in sfida. */
  valid: boolean
  /** Le carte del mazzo, nell'ordine degli slot. */
  cards: CardThumb[]
}

/**
 * Dati della Home: `GET /api/home` (contratto API §3.2).
 * Un solo endpoint per tutta la Home, caricato all'ingresso con il riepilogo del giocatore.
 */
export interface HomeSummary {
  /** Sfide premiate oggi: le prime 5 del giorno danno ricompense. */
  rewardedChallenges: Progress
  /** "Ti aspettano": sfide ricevute, Rotoli da guardare, scambi ricevuti. */
  waiting: WaitingItem[]
  deck: ActiveDeck
  /** Missioni del giorno. */
  missions: Progress
  packs: {
    /** Pacchetti base acquistabili con il saldo attuale. */
    affordable: number
    /** Stelle aperte dall'ultimo Sole, su quante ne garantiscono uno. */
    sunCounter: Progress
  }
  fullMoon: {
    /** Inizio della prossima luna piena (cambio di Fazione). */
    nextAt: string
    /** Vero se la finestra di cambio è aperta adesso. */
    windowOpen: boolean
  }
}
