import type { Faction, SignCode } from '@/domain/game'

/**
 * Passi dei primi passi con Ermes (tavole Benvenuto-*). Il backend per ora conosce solo
 * `FACTION`; gli altri sono quelli del contratto e arriveranno con le loro pagine.
 */
export type OnboardingStep = 'FACTION' | 'FIRST_SKY' | 'PACKS' | 'DECK' | 'FIRST_CHALLENGE'

/**
 * Riepilogo del giocatore per la barra di gioco: `GET /api/players/me`
 * (contratto API §3.1).
 */
export interface PlayerSummary {
  id: number
  nickname: string
  /** Segno del Sole, dal giorno di nascita (la data non si salva). */
  sign: SignCode
  /** Saldo dei crediti. */
  credits: number
  /** Fazione scelta; `null` finché non la sceglie (primo passo con Ermes). */
  faction: Faction | null
  /** Novità senza un'azione da fare (la campanella). */
  unreadNotifications: number
  /** Cose da fare, contate sulla loro voce della barra. */
  pending: {
    /** Sfide ricevute a cui rispondere. */
    challenges: number
    /** Scambi ricevuti a cui rispondere. */
    trades: number
    /** Rotoli non ancora visti. */
    replays: number
  }
  onboarding: {
    completed: boolean
    /** Il passo da cui riprendere; `null` se il percorso è finito. */
    currentStep: OnboardingStep | null
  }
}
