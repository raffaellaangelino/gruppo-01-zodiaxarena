import type { Faction, PlanetCode, SignCode } from '@/domain/game'

/** I due lati della partita, come li chiama l'engine. */
export type MatchSide = 'A' | 'B'

/** Esito dal punto di vista di chi guarda. */
export type MatchOutcome = 'WIN' | 'LOSS' | 'DRAW'

/** Perché la partita è finita (`EndReason` dell'engine). */
export type EndReason = 'KO' | 'DECKS_EXHAUSTED' | 'ROUND_LIMIT'

/** Un giocatore della partita: dopo il Rotolo la sua Fazione si conosce (D-014). */
export interface MatchPlayer {
  id: number
  nickname: string
  faction: Faction
}

/** Una carta come la nomina l'engine ("Leone / Sole / Casa I"), già riconosciuta. */
export interface MatchCard {
  sign: SignCode
  /** `null` se l'engine nomina un Ascendente. */
  planet: PlanetCode | null
  /** Nome stampato ("Sole in Leone"). */
  name: string
}

/** Una voce di un bonus o di una riduzione, già in italiano ("Sole", "Efesto", "Vantaggio"). */
export interface Contribution {
  label: string
  amount: number
}

/**
 * Evento della partita, tradotto dal log dell'engine. Il frontend non ricalcola nulla:
 * mostra questi valori (contratto API §8.3).
 */
export type MatchEvent =
  | {
      type: 'ENTERED'
      round: number
      side: MatchSide
      card: MatchCard
      attack: number
      defense: number
      attackParts: Contribution[]
      defenseParts: Contribution[]
      airDice: { attack: number[]; defense: number[] } | null
      deckLeft: number | null
    }
  | { type: 'ROUND'; round: number; hp: Record<MatchSide, number> }
  | {
      type: 'ATTACK'
      round: number
      side: MatchSide
      card: MatchCard
      target: MatchCard
      total: number
      parts: Contribution[]
    }
  | {
      type: 'DAMAGE'
      round: number
      side: MatchSide
      card: MatchCard
      applied: number
      before: number
      after: number
      reductions: Contribution[]
    }
  | { type: 'DEFEATED'; round: number; side: MatchSide; card: MatchCard; mutual: boolean }
  | {
      type: 'HP_LOSS'
      round: number
      side: MatchSide
      card: MatchCard
      excess: number
      applied: number
      reductions: Contribution[]
      hpLeft: number
    }

/** Una partita giocata, dal punto di vista di chi guarda. */
export interface Match {
  id: number
  /** Da che parte sta chi guarda (sempre a sinistra nelle schermate). */
  me: MatchSide
  playedAt: string | null
  players: Record<MatchSide, MatchPlayer>
  outcome: MatchOutcome
  reason: EndReason
  rounds: number
  finalHp: Record<MatchSide, number>
  /** Criterio dello spareggio, se c'è stato. */
  tieBreaker: string | null
  events: MatchEvent[]
}
