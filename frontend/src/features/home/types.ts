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
 * Finché il backend non lo ha, la Home li compone dalle API che esistono (`features/home/compose`)
 * e le parti senza fonte valgono `null`: non si mostrano, invece di numeri finti.
 */
export interface HomeSummary {
  /** Sfide premiate oggi: le prime 5 del giorno danno ricompense. `null` finché il backend non le ha. */
  rewardedChallenges: Progress | null
  /** "Ti aspettano": sfide ricevute, Rotoli da guardare, scambi ricevuti. */
  waiting: WaitingItem[]
  /** Il Cielo in uso; `null` se il giocatore non ne ha. */
  deck: ActiveDeck | null
  /** Missioni del giorno; `null` finché il backend non le ha. */
  missions: Progress | null
  /** Pacchetti; `null` finché il backend non ha il Negozio. */
  packs: {
    /** Pacchetti base acquistabili con il saldo attuale. */
    affordable: number
    /** Stelle aperte dall'ultimo Sole, su quante ne garantiscono uno. */
    sunCounter: Progress
  } | null
  /** Luna piena; `null` finché il backend non la manda. */
  fullMoon: {
    /** Inizio della prossima luna piena (cambio di Fazione). */
    nextAt: string
    /** Vero se la finestra di cambio è aperta adesso. */
    windowOpen: boolean
  } | null
}
