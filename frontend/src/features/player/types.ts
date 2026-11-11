import type { Faction } from '@/domain/game'

/** Riepilogo del giocatore per la barra di gioco: chi sei, quanto hai, cosa ti aspetta. */
export interface PlayerSummary {
  nickname: string
  /** Saldo dei crediti. */
  credits: number
  /** Fazione scelta; `null` se il giocatore non l'ha ancora scelta. */
  faction: Faction | null
  /** Notifiche non lette senza un'azione da fare (la campanella). */
  unreadNotifications: number
  /** Cose da fare, contate sulla loro voce della barra. */
  pending: {
    /** Sfide ricevute a cui rispondere. */
    challenges: number
    /** Scambi ricevuti a cui rispondere. */
    trades: number
  }
}
