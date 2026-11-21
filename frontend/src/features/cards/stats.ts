import { PLANET_LABELS, SIGN_LABELS } from '@/domain/labels'
import type { CardDefinition } from '@/features/cards/types'

/** Valori dei dadi d'Aria (regolamento ed engine: 2d4×2). */
export const AIR_DICE = { min: 4, max: 16 } as const

/** ATK o DEF stampati su una carta, con la loro scomposizione. */
export interface PrintedStat {
  /** "21", oppure un intervallo per l'Aria ("6–18"). */
  value: string
  /** "12 Leone + 9 Sole"; per l'Aria "dadi 2d4×2 (4–16) + 2 Mercurio". */
  parts: string
}

/**
 * ATK e DEF come sono stampati sulla carta: segno (o dadi d'Aria) più pianeta, con i valori del
 * catalogo. I bonus che arrivano in campo (Dio, elemento, Ascendente, Casa, vantaggio) li applica
 * l'engine e non sono qui.
 *
 * @param card Carta del catalogo.
 * @returns ATK e DEF stampati.
 */
export function printedStats(card: CardDefinition): { atk: PrintedStat; def: PrintedStat } {
  const isAir = card.element === 'AIR'
  const planet = card.planetStats
  const planetName = card.planet ? PLANET_LABELS[card.planet] : null
  const stat = (sign: number, bonus: number | undefined): PrintedStat => {
    const add = bonus ?? 0
    const value = isAir ? `${AIR_DICE.min + add}–${AIR_DICE.max + add}` : String(sign + add)
    const base = isAir
      ? `dadi 2d4×2 (${AIR_DICE.min}–${AIR_DICE.max})`
      : `${sign} ${SIGN_LABELS[card.sign]}`
    const parts = [base, bonus !== undefined && planetName && `${bonus} ${planetName}`]
      .filter(Boolean)
      .join(' + ')
    return { value, parts }
  }
  return { atk: stat(card.signStats.atk, planet?.atk), def: stat(card.signStats.def, planet?.def) }
}
