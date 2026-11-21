import { plural } from '@/lib/plural'
import type { Match, MatchCard, MatchEvent, MatchSide } from '@/features/matches/types'

/**
 * Lettura della partita per le persone: i momenti decisivi e il perché della fine, per il
 * Verdetto (le frasi del Racconto stanno in `replay.ts`). Sono solo letture dei valori
 * dell'engine, nessuna regola rifatta qui (contratto API §8.3).
 */

/** Un momento decisivo del Verdetto. */
export interface KeyMoment {
  /** "2" oppure "4–6". */
  rounds: string
  card: MatchCard
  /** Frase introduttiva prima del nome della carta (es. "Il colpo più pesante:"). */
  lead: string
  /** Frase dopo il nome della carta (es. ", 25 di attacco"). */
  tail: string
}

type Attack = Extract<MatchEvent, { type: 'ATTACK' }>

/**
 * I momenti che hanno deciso la partita (tavola Sfide-Verdetto, "Cosa ha deciso la partita"):
 * il colpo più pesante, la tua creatura rimasta più a lungo in campo (da due round in su), il
 * colpo finale. Senza doppioni: se il colpo più pesante è quello finale, resta il finale.
 *
 * @param match Partita.
 * @returns Da zero a tre momenti, in ordine di round.
 */
export function keyMoments(match: Match): KeyMoment[] {
  const moments: KeyMoment[] = []
  const attacks = match.events.filter((e): e is Attack => e.type === 'ATTACK')
  const mine = attacks.filter((a) => a.side === match.me)

  const heaviest = mine.reduce<Attack | null>(
    (best, a) => (!best || a.total > best.total ? a : best),
    null,
  )
  if (heaviest) {
    moments.push({
      rounds: String(heaviest.round),
      card: heaviest.card,
      lead: match.outcome === 'LOSS' ? 'Il tuo colpo migliore:' : 'Il colpo più pesante:',
      tail: `, ${heaviest.total} di attacco`,
    })
  }

  // La tua creatura rimasta più round in campo.
  const entered = new Map<string, number>()
  let longest: { card: MatchCard; from: number; to: number } | null = null
  for (const event of match.events) {
    if (event.type === 'ROUND' || event.side !== match.me) continue
    if (event.type === 'ENTERED') entered.set(event.card.name, event.round)
    if (event.type === 'DEFEATED') {
      const from = entered.get(event.card.name) ?? event.round
      if (!longest || event.round - from > longest.to - longest.from)
        longest = { card: event.card, from, to: event.round }
      entered.delete(event.card.name)
    }
  }
  for (const [name, from] of entered) {
    const enteredEvent = match.events.find(
      (e): e is Extract<MatchEvent, { type: 'ENTERED' }> =>
        e.type === 'ENTERED' && e.card.name === name,
    )
    const card = enteredEvent?.card
    if (card && (!longest || match.rounds - from > longest.to - longest.from))
      longest = { card, from, to: match.rounds }
  }
  // Una creatura conta come "la migliore" solo se è rimasta in campo almeno due round.
  if (longest && longest.to > longest.from) {
    const span = longest.to - longest.from + 1
    moments.push({
      rounds: span > 1 ? `${longest.from}–${longest.to}` : String(longest.from),
      card: longest.card,
      lead: 'La tua migliore:',
      tail: `, in campo per ${plural(span, 'round', 'round')}`,
    })
  }

  // Il colpo finale: l'ultimo danno ai PV e la carta che l'ha portato.
  const lastHp = [...match.events].reverse().find((e) => e.type === 'HP_LOSS')
  if (lastHp && lastHp.type === 'HP_LOSS') {
    const blow = attacks.find((a) => a.round === lastHp.round && a.target.name === lastHp.card.name)
    if (blow) {
      const target = lastHp.side === match.me ? 'a te' : `a ${match.players[lastHp.side].nickname}`
      moments.push({
        rounds: String(lastHp.round),
        card: blow.card,
        lead: 'Il colpo finale:',
        tail: `, ${lastHp.applied} PV ${target}`,
      })
    }
  }

  // Se il colpo più pesante è anche quello finale, resta solo il finale.
  const final = moments.find((m) => m.lead === 'Il colpo finale:')
  const distinct = moments.filter(
    (m) => m === final || !final || m.card.name !== final.card.name || m.rounds !== final.rounds,
  )
  return distinct.sort((a, b) => parseInt(a.rounds, 10) - parseInt(b.rounds, 10))
}

/**
 * Perché è finita, in una riga (tavola Sfide-Verdetto): "KO al round 3 · Orione a 0 PV".
 *
 * @param match Partita.
 * @returns Il testo.
 */
export function endSummary(match: Match): string {
  const loser = (Object.keys(match.finalHp) as MatchSide[]).find((s) => match.finalHp[s] === 0)
  const loserText =
    loser === match.me
      ? ' · i tuoi PV a 0'
      : loser
        ? ` · ${match.players[loser].nickname} a 0 PV`
        : ''
  switch (match.reason) {
    case 'KO':
      return `KO al round ${match.rounds}${loserText}`
    case 'DECKS_EXHAUSTED':
      return `Mazzi esauriti al round ${match.rounds}`
    case 'ROUND_LIMIT':
      return `Limite di ${match.rounds} round raggiunto`
  }
}
