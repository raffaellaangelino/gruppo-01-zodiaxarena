import type { Element } from '@/domain/game'
import { ELEMENT_WITH_ARTICLE, PLANET_LABELS } from '@/domain/labels'
import { SIGN_ELEMENT } from '@/domain/rules'
import { endSummary } from '@/features/matches/chronicle'
import type {
  Contribution,
  Match,
  MatchCard,
  MatchEvent,
  MatchSide,
} from '@/features/matches/types'

/**
 * Il Racconto del Rotolo passo per passo (tavola Sfide-Rotolo, `ux/challenge-replay.md` S10).
 * Trasforma gli eventi dell'engine in una sequenza di momenti, ognuno con lo stato completo
 * dell'arena: così si può andare avanti, indietro o saltare a un round senza ricalcolare nulla.
 * Nessuna regola rifatta qui: solo i valori dell'engine, messi in ordine.
 */

/** Stato di una carta del mazzo, per i segnalini della piastra. */
export type TokenState = 'left' | 'inPlay' | 'fallen'

/** Un colpo subito, per la scomposizione della DEF ("Colpo di Mercurio in Bilancia −12"). */
export interface Hit {
  attacker: MatchCard
  round: number
  amount: number
}

/** Una creatura in campo, com'è in quel momento. */
export interface ArenaCreature {
  card: MatchCard
  /** ATK del round in corso (all'ingresso, quello calcolato dall'engine entrando). */
  attack: number
  attackParts: Contribution[]
  /** DEF attuale. */
  defense: number
  /** DEF all'ingresso ("su 15"). */
  defenseMax: number
  defenseParts: Contribution[]
  hits: Hit[]
  airDice: { attack: number[]; defense: number[] } | null
  /** Caduta in questo round: resta in campo, inclinata, fino alla prossima pesca. */
  fallen: boolean
}

/** Vantaggio di elemento del round ("La Terra batte l'Aria: +1 ATK a Venere in Toro"). */
export interface Advantage {
  side: MatchSide
  card: MatchCard
  winner: Element
  loser: Element
  amount: number
}

/** Un pezzo di frase: il testo normale, in evidenza o in rosso (danno ai PV). */
export interface TextSegment {
  text: string
  tone?: 'strong' | 'danger'
}

/** Tipo di momento: ingresso, vantaggio del round, colpo simultaneo, fine. */
export type StepKind = 'enter' | 'advantage' | 'clash' | 'end'

/** Un momento del Racconto, con lo stato completo dell'arena. */
export interface ReplayStep {
  kind: StepKind
  turn: number
  round: number
  hp: Record<MatchSide, number>
  /** PV persi proprio in questo momento (le stelle che si spengono). */
  hpLost: Record<MatchSide, number>
  creatures: Record<MatchSide, ArenaCreature | null>
  tokens: Record<MatchSide, TokenState[]>
  /** Il vantaggio del round in corso, dal suo annuncio fino al colpo. */
  advantage: Advantage | null
  /** La frase della Cronaca. */
  text: TextSegment[]
}

/** PV iniziali (regolamento: 10 per giocatore). Si usano solo se il log non ha round. */
const STARTING_HP = 10

type Entered = Extract<MatchEvent, { type: 'ENTERED' }>
type Attack = Extract<MatchEvent, { type: 'ATTACK' }>
type Damage = Extract<MatchEvent, { type: 'DAMAGE' }>
type Defeated = Extract<MatchEvent, { type: 'DEFEATED' }>
type HpLoss = Extract<MatchEvent, { type: 'HP_LOSS' }>

const other = (side: MatchSide): MatchSide => (side === 'A' ? 'B' : 'A')
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`)

/**
 * Un numero come si stampa nel gioco: i negativi con il segno meno vero ("−8", non "-8").
 *
 * @param n Numero.
 * @returns Il testo.
 */
export const formatNumber = (n: number): string => (n < 0 ? `−${Math.abs(n)}` : String(n))

/**
 * I bonus all'ingresso in una frase breve: "Mercurio +2 ATK; Casa I +2 DEF; Demetra +1/+1".
 * La prima voce (segno o dadi d'Aria) è la base e si dice a parte.
 */
function bonusText(event: Entered): string {
  const byLabel = new Map<string, { atk: number; def: number }>()
  const add = (parts: Contribution[], key: 'atk' | 'def') => {
    for (const part of parts.slice(1)) {
      if (part.amount === 0) continue
      const entry = byLabel.get(part.label) ?? { atk: 0, def: 0 }
      entry[key] += part.amount
      byLabel.set(part.label, entry)
    }
  }
  add(event.attackParts, 'atk')
  add(event.defenseParts, 'def')
  return [...byLabel]
    .map(([label, { atk, def }]) =>
      atk && def
        ? `${label} ${signed(atk)}/${signed(def)}`
        : atk
          ? `${label} ${signed(atk)} ATK`
          : `${label} ${signed(def)} DEF`,
    )
    .join('; ')
}

/** Frase dell'ingresso: "Lyra pesca Mercurio in Bilancia. Dadi d'Aria: ATK 10, DEF 8; Mercurio +2 ATK." */
function enterText(event: Entered, nickname: string): TextSegment[] {
  const bonuses = bonusText(event)
  const base = event.airDice
    ? `Dadi d'Aria: ATK ${event.attackParts[0]?.amount ?? 0}, DEF ${event.defenseParts[0]?.amount ?? 0}`
    : ''
  const detail = [base, bonuses].filter(Boolean).join('; ')
  return [
    { text: `${nickname} pesca ` },
    { text: event.card.name, tone: 'strong' },
    { text: detail ? `. ${detail}.` : '.' },
  ]
}

/** Prende gli eventi dello scontro di un round (colpi, danni, cadute, PV) a partire da `from`. */
function clashEvents(events: MatchEvent[], from: number, round: number) {
  const attacks: Attack[] = []
  const damages: Damage[] = []
  const defeats: Defeated[] = []
  const hpLosses: HpLoss[] = []
  let end = from
  for (let i = from; i < events.length; i++) {
    const event = events[i]
    if (event.round !== round || event.type === 'ENTERED' || event.type === 'ROUND') break
    if (event.type === 'ATTACK') attacks.push(event)
    else if (event.type === 'DAMAGE') damages.push(event)
    else if (event.type === 'DEFEATED') defeats.push(event)
    else hpLosses.push(event)
    end = i + 1
  }
  return { attacks, damages, defeats, hpLosses, end }
}

/**
 * Il Racconto della partita, un momento per volta.
 *
 * @param match Partita.
 * @returns I momenti in ordine; l'ultimo è sempre la fine ("Atropo taglia il filo").
 */
export function buildReplay(match: Match): ReplayStep[] {
  const nickname = (side: MatchSide) => match.players[side].nickname
  const viewerFirst: MatchSide[] = [match.me, other(match.me)]
  const firstRound = match.events.find((e) => e.type === 'ROUND')

  let hp: Record<MatchSide, number> =
    firstRound?.type === 'ROUND' ? { ...firstRound.hp } : { A: STARTING_HP, B: STARTING_HP }
  let creatures: Record<MatchSide, ArenaCreature | null> = { A: null, B: null }
  let tokens: Record<MatchSide, TokenState[]> = {
    A: match.decks.A.map(() => 'left'),
    B: match.decks.B.map(() => 'left'),
  }
  let turn = 0
  let round = 0
  let newTurn = true
  let advantage: Advantage | null = null
  /** Vantaggio già annunciato in questo turno: vale per ogni round, si dice una volta sola. */
  let announced: string | null = null
  const steps: ReplayStep[] = []

  const mark = (side: MatchSide, card: MatchCard, from: TokenState, to: TokenState) => {
    const index = match.decks[side].findIndex(
      (c, i) => c.name === card.name && tokens[side][i] === from,
    )
    if (index < 0) return
    tokens = { ...tokens, [side]: tokens[side].map((t, i) => (i === index ? to : t)) }
  }
  const push = (kind: StepKind, text: TextSegment[], hpLost = { A: 0, B: 0 }) =>
    steps.push({ kind, turn, round, hp, hpLost, creatures, tokens, advantage, text })

  const { events } = match
  let i = 0
  while (i < events.length) {
    const event = events[i]

    if (event.type === 'ENTERED') {
      if (newTurn) {
        turn += 1
        newTurn = false
        advantage = null
        announced = null
      }
      round = event.round
      creatures = {
        ...creatures,
        [event.side]: {
          card: event.card,
          attack: event.attack,
          attackParts: event.attackParts,
          defense: event.defense,
          defenseMax: event.defense,
          defenseParts: event.defenseParts,
          hits: [],
          airDice: event.airDice,
          fallen: false,
        },
      }
      mark(event.side, event.card, 'left', 'inPlay')
      push('enter', enterText(event, nickname(event.side)))
      i += 1
      continue
    }

    if (event.type !== 'ROUND') {
      // Eventi fuori da un round (non dovrebbero esserci): si saltano senza fermare il Racconto.
      i += 1
      continue
    }

    round = event.round
    hp = { ...event.hp }
    const { attacks, damages, defeats, hpLosses, end } = clashEvents(events, i + 1, round)
    i = end

    // ATK del round: quello calcolato dall'engine per questo colpo (può cambiare da un round all'altro).
    const next = { ...creatures }
    for (const attack of attacks) {
      const creature = next[attack.side]
      if (creature)
        next[attack.side] = { ...creature, attack: attack.total, attackParts: attack.parts }
    }
    creatures = next

    const boosted = attacks.find((a) =>
      a.parts.some((p) => p.label === 'Vantaggio' && p.amount > 0),
    )
    advantage = boosted
      ? {
          side: boosted.side,
          card: boosted.card,
          winner: SIGN_ELEMENT[boosted.card.sign],
          loser: SIGN_ELEMENT[boosted.target.sign],
          amount: boosted.parts.find((p) => p.label === 'Vantaggio')?.amount ?? 0,
        }
      : null
    const advantageKey = advantage ? `${advantage.side}:${advantage.card.name}` : null
    if (advantage && advantageKey !== announced) {
      announced = advantageKey
      push('advantage', [
        {
          text: `${capitalize(ELEMENT_WITH_ARTICLE[advantage.winner])} batte ${ELEMENT_WITH_ARTICLE[advantage.loser]}: ${signed(advantage.amount)} ATK a ${advantage.card.name}.`,
        },
      ])
    }

    if (attacks.length === 0 && damages.length === 0) continue

    // Il colpo simultaneo: DEF, cadute e PV cambiano tutti insieme (il motore li calcola insieme).
    const after = { ...creatures }
    for (const damage of damages) {
      const creature = after[damage.side]
      const blow = attacks.find((a) => a.side === other(damage.side))
      if (!creature) continue
      after[damage.side] = {
        ...creature,
        defense: damage.after,
        hits: blow
          ? [...creature.hits, { attacker: blow.card, round, amount: -damage.applied }]
          : creature.hits,
      }
    }
    for (const defeat of defeats) {
      const creature = after[defeat.side]
      if (creature) after[defeat.side] = { ...creature, fallen: true }
      mark(defeat.side, defeat.card, 'inPlay', 'fallen')
    }
    creatures = after

    const hpLost = { A: 0, B: 0 }
    const nextHp = { ...hp }
    for (const loss of hpLosses) {
      hpLost[loss.side] = Math.max(0, nextHp[loss.side] - loss.hpLeft)
      nextHp[loss.side] = loss.hpLeft
    }
    hp = nextHp

    const text: TextSegment[] = [{ text: 'I colpi partono insieme.', tone: 'strong' }]
    for (const side of viewerFirst) {
      const attack = attacks.find((a) => a.side === side)
      const damage = damages.find((d) => d.side === other(side))
      if (!attack || !damage) continue
      const falls = defeats.some((d) => d.side === damage.side)
      text.push({
        text: ` ${attack.card.name} infligge ${damage.applied}: ${damage.card.name} scende da ${formatNumber(damage.before)} a ${formatNumber(damage.after)}${falls ? ' e cade' : ''}.`,
      })
    }
    if (defeats.length === 2 && defeats.every((d) => d.mutual)) {
      text.push({ text: ' Morte reciproca: nessuno perde PV.' })
    }
    for (const loss of hpLosses) {
      const blow = attacks.find((a) => a.side === other(loss.side))
      const hit = damages.find((d) => d.side === loss.side)
      // "10 − 8 = 2" solo se i numeri dell'engine tornano: altrimenti si dice solo l'eccesso.
      const sum =
        blow && hit && blow.total - hit.before === loss.excess
          ? `${blow.total} − ${hit.before} = ${loss.excess}`
          : `${loss.excess}`
      const reductions = loss.reductions
        .filter((r) => r.amount !== 0)
        .map((r) => ` → ${r.label} −${Math.abs(r.amount)}`)
        .join('')
      const final = reductions || loss.applied !== loss.excess ? ` → ${loss.applied}` : ''
      text.push({
        text: ` Danno in eccesso: ${sum}${reductions}${final} PV a ${nickname(loss.side)}.`,
        tone: 'danger',
      })
    }
    push('clash', text, hpLost)
    advantage = null
    if (defeats.length > 0) newTurn = true
  }

  const winner =
    match.outcome === 'DRAW' ? null : match.outcome === 'WIN' ? match.me : other(match.me)
  push('end', [
    { text: 'Atropo taglia il filo.', tone: 'strong' },
    {
      text: winner
        ? ` Vince ${nickname(winner)}: ${endSummary(match)}.`
        : ` Pareggio: ${endSummary(match)}.`,
    },
  ])
  return steps
}

/**
 * Il primo momento di un round, per saltarci dalla costellazione dei round o dalla Cronaca.
 *
 * @param steps Momenti del Racconto.
 * @param round Round cercato.
 * @returns L'indice, oppure `-1` se il round non c'è.
 */
export function firstStepOfRound(steps: ReplayStep[], round: number): number {
  return steps.findIndex((s) => s.round === round)
}

const PLANETS = new Set<string>(Object.values(PLANET_LABELS))

/**
 * I bonus attivi sotto la carta (ux/challenge-replay.md: vantaggio, Dio, Ascendente, Casa):
 * "Dadi d'Aria 10 / 8 · Demetra +1/+1 · Vantaggio +1 ATK". Il pianeta fa parte della carta e
 * resta nella scomposizione completa.
 *
 * @param creature Creatura in campo.
 * @returns Le voci, già scritte.
 */
export function activeBonuses(creature: ArenaCreature): string[] {
  const byLabel = new Map<string, { atk: number; def: number }>()
  const add = (parts: Contribution[], key: 'atk' | 'def') => {
    for (const part of parts.slice(1)) {
      if (part.amount === 0 || PLANETS.has(part.label)) continue
      const entry = byLabel.get(part.label) ?? { atk: 0, def: 0 }
      entry[key] += part.amount
      byLabel.set(part.label, entry)
    }
  }
  add(creature.attackParts, 'atk')
  add(creature.defenseParts, 'def')
  const dice = creature.airDice
    ? [
        `Dadi d'Aria ${creature.attackParts[0]?.amount ?? 0} / ${creature.defenseParts[0]?.amount ?? 0}`,
      ]
    : []
  return [
    ...dice,
    ...[...byLabel].map(([label, { atk, def }]) =>
      atk && def
        ? `${label} ${signed(atk)}/${signed(def)}`
        : atk
          ? `${label} ${signed(atk)} ATK`
          : `${label} ${signed(def)} DEF`,
    ),
  ]
}
