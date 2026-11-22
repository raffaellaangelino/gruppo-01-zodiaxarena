import type { GodCode } from '@/domain/game'
import { cardName, GOD_LABELS, PLANET_LABELS, SIGN_LABELS } from '@/domain/labels'
import { GOD_ELEMENT, SIGN_ELEMENT, toPlanetCode, toSignCode } from '@/domain/rules'
import type {
  Contribution,
  EndReason,
  Match,
  MatchCard,
  MatchEvent,
  MatchOutcome,
  MatchSide,
} from '@/features/matches/types'

/**
 * Forme del backend per una partita. `result` è il risultato dell'engine così come lo salva il
 * backend (`engine_payload`), con il log degli eventi: il backend deve solo aggiungere chi sono i
 * giocatori e da che parte sta chi guarda (contratto API §8.2, forma ridotta per il SAL).
 */

/** Una voce di un bonus come la scrive l'engine (`Contribution`). */
interface EngineContribution {
  amount: number
  source: string
}

/** Un evento del log dell'engine (`GameEvent`). */
export interface EngineEventDto {
  type: string
  round: number
  player: MatchSide | null
  /** Carta come la nomina l'engine: "Leone / Sole / Casa I". */
  card: string | null
  details: Record<string, unknown>
}

/** Risultato dell'engine (`GameResult`). */
export interface EngineResultDto {
  seed: number
  outcome: 'PLAYER_A_WINS' | 'PLAYER_B_WINS' | 'DRAW'
  reason: EndReason
  playerAPv: number
  playerBPv: number
  roundsPlayed: number
  tieBreaker: string | null
  log: EngineEventDto[]
}

/** Risposta di `GET /api/matches/{id}`. */
export interface MatchDto {
  id: number
  me: MatchSide
  playedAt: string | null
  players: Record<MatchSide, { id: number; nickname: string; god: GodCode }>
  result: EngineResultDto
}

/**
 * Riconosce una carta dal nome che usa l'engine ("Leone / Sole / Casa I").
 *
 * @param label Nome della carta nell'engine.
 * @returns Segno, pianeta e nome stampato.
 * @throws {Error} Se il segno non è conosciuto.
 */
export function parseEngineCard(label: string): MatchCard {
  const [signName = '', planetName = ''] = label.split(' / ')
  const sign = toSignCode(signName)
  if (!sign) throw new Error(`Carta dell'engine non riconosciuta: ${label}`)
  const planet = toPlanetCode(planetName)
  return { sign, planet, name: cardName(planet, sign) }
}

/**
 * Nome italiano della fonte di un bonus. L'engine oggi scrive le fonti in modi diversi
 * ("planet Sole", "sign or Air roll", "DEMETRA", "Efesto", "vantaggio elemento"): si traducono
 * qui, in un posto solo, finché il backend non manda dei codici (contratto API §8.3).
 *
 * @param source Fonte come la scrive l'engine.
 * @param card Carta a cui si riferisce (per il segno e i dadi dell'Aria).
 * @returns Il nome da mostrare.
 */
function sourceLabel(source: string, card: MatchCard): string {
  if (source === 'sign or Air roll') {
    return SIGN_ELEMENT[card.sign] === 'AIR' ? "Dadi d'Aria" : SIGN_LABELS[card.sign]
  }
  if (source.startsWith('planet ')) {
    const planet = toPlanetCode(source.slice('planet '.length))
    return planet ? PLANET_LABELS[planet] : source
  }
  if (source === 'vantaggio elemento') return 'Vantaggio'
  const god = source.toUpperCase() as GodCode
  if (god in GOD_LABELS) return GOD_LABELS[god].name
  return source
}

/** Legge un elenco di bonus dai dettagli di un evento. */
function contributions(value: unknown, card: MatchCard): Contribution[] {
  if (!Array.isArray(value)) return []
  return (value as EngineContribution[]).map(({ amount, source }) => ({
    label: sourceLabel(source, card),
    amount,
  }))
}

const num = (value: unknown): number => (typeof value === 'number' ? value : 0)
const numbers = (value: unknown): number[] =>
  Array.isArray(value) ? value.filter((n): n is number => typeof n === 'number') : []

/**
 * Traduce un evento dell'engine; gli eventi che non servono alla cronaca (mescolata, pescata,
 * inizio e fine) restano fuori: inizio e fine stanno già nel risultato, l'ordine dei mazzi in
 * `Match.decks`.
 *
 * @param event Evento dell'engine.
 * @param deckLeft Carte rimaste nel mazzo dopo l'ultima pescata di quel lato.
 * @returns L'evento tradotto, oppure `null`.
 */
function toMatchEvent(event: EngineEventDto, deckLeft: number | null): MatchEvent | null {
  const { type, round, player: side, details } = event
  const card = event.card ? parseEngineCard(event.card) : null
  if (type === 'round_started') {
    return { type: 'ROUND', round, hp: { A: num(details.playerAPv), B: num(details.playerBPv) } }
  }
  if (!side || !card) return null
  switch (type) {
    case 'card_entered_play': {
      const attackDice = numbers(details.airAttackDice)
      return {
        type: 'ENTERED',
        round,
        side,
        card,
        attack: num(details.attack),
        defense: num(details.defense),
        attackParts: [
          { label: sourceLabel('sign or Air roll', card), amount: num(details.baseAttack) },
          ...contributions(details.attackBonuses, card),
        ],
        defenseParts: [
          { label: sourceLabel('sign or Air roll', card), amount: num(details.baseDefense) },
          ...contributions(details.defenseBonuses, card),
        ],
        airDice: attackDice.length
          ? { attack: attackDice, defense: numbers(details.airDefenseDice) }
          : null,
        deckLeft,
      }
    }
    case 'attack':
      return {
        type: 'ATTACK',
        round,
        side,
        card,
        target: parseEngineCard(String(details.defender)),
        total: num(details.total),
        parts: contributions(details.contributions, card),
      }
    case 'damage_taken':
      return {
        type: 'DAMAGE',
        round,
        side,
        card,
        applied: num(details.applied),
        before: num(details.defenseBefore),
        after: num(details.defenseAfter),
        reductions: contributions(details.reductions, card),
      }
    case 'card_defeated':
      return { type: 'DEFEATED', round, side, card, mutual: details.mutualDeath === true }
    case 'pv_damage':
      return {
        type: 'HP_LOSS',
        round,
        side,
        card,
        excess: num(details.excess),
        applied: num(details.applied),
        reductions: contributions(details.reductions, card),
        hpLeft: num(details.remainingPv),
      }
    default:
      return null
  }
}

/**
 * Traduce una partita del backend nella forma dell'interfaccia, dal punto di vista di chi guarda.
 *
 * @param dto Partita come la manda il backend.
 * @returns La partita.
 */
export function toMatch(dto: MatchDto): Match {
  const { result } = dto
  const winner: MatchSide | null =
    result.outcome === 'PLAYER_A_WINS' ? 'A' : result.outcome === 'PLAYER_B_WINS' ? 'B' : null
  const outcome: MatchOutcome = winner === null ? 'DRAW' : winner === dto.me ? 'WIN' : 'LOSS'

  const deckLeft: Record<MatchSide, number | null> = { A: null, B: null }
  const decks: Record<MatchSide, MatchCard[]> = { A: [], B: [] }
  const events: MatchEvent[] = []
  for (const event of result.log) {
    if (event.type === 'deck_shuffled' && event.player) {
      const cards = event.details.cards
      if (Array.isArray(cards)) decks[event.player] = cards.map((c) => parseEngineCard(String(c)))
      continue
    }
    if (event.type === 'card_drawn' && event.player) {
      deckLeft[event.player] = num(event.details.cardsRemaining)
      continue
    }
    const parsed = toMatchEvent(event, event.player ? deckLeft[event.player] : null)
    if (parsed) events.push(parsed)
  }

  const player = (side: MatchSide) => {
    const { id, nickname, god } = dto.players[side]
    return { id, nickname, faction: { god, element: GOD_ELEMENT[god] } }
  }

  return {
    id: dto.id,
    me: dto.me,
    playedAt: dto.playedAt,
    players: { A: player('A'), B: player('B') },
    outcome,
    reason: result.reason,
    rounds: result.roundsPlayed,
    finalHp: { A: result.playerAPv, B: result.playerBPv },
    tieBreaker: result.tieBreaker,
    decks,
    events,
  }
}
