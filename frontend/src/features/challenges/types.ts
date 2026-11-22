import type { PlayerRef } from '@/domain/game'

/** Stato di una sfida (`ChallengeStatus` del backend). */
export type ChallengeStatus =
  'PENDING' | 'PLAYED' | 'DECLINED' | 'WITHDRAWN' | 'EXPIRED' | 'CANCELLED'

/** Perché una sfida inviata si è chiusa senza partita (`ChallengeCancelReason`). */
export type ChallengeCancelReason =
  'DECLINED' | 'WITHDRAWN' | 'DECK_CHANGED' | 'EXPIRED' | 'CANCELLED'

/** Le due liste della pagina Sfide: da giocare (ricevute) e inviate. */
export type ChallengeBox = 'TO_PLAY' | 'SENT'

/** Una sfida, dal punto di vista di chi guarda. */
export interface Challenge {
  id: number
  status: ChallengeStatus
  /** `RECEIVED`: ti hanno sfidato · `SENT`: hai sfidato tu. */
  direction: 'RECEIVED' | 'SENT'
  /** L'altro giocatore (la sua Fazione si scopre solo nel Rotolo, D-014). */
  opponent: PlayerRef
  /** Quando è stata lanciata (ISO 8601). */
  createdAt: string
  /** Scadenza; `null` finché il team non decide la regola (Q-11). */
  expiresAt: string | null
  /** La partita, dopo l'accettazione. */
  matchId: number | null
  cancelReason: ChallengeCancelReason | null
}
