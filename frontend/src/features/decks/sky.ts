import type { Element } from '@/domain/game'
import type { Catalog } from '@/features/cards/queries'
import type { CardDefinition } from '@/features/cards/types'
import { DECK_SLOTS, type DeckSlot } from '@/features/decks/types'

/**
 * Il Cielo mentre lo si compone (S07, tavole Collezione-Cielo e Collezione-Cielo-Problemi): le
 * caselle, il conteggio degli elementi e gli avvisi in anteprima.
 *
 * Gli avvisi sono un'anteprima del frontend, finché il backend non manda i suoi problemi (regole
 * V1–V8 ancora spente): seguono il regolamento e il controllo dell'engine sui mazzi. Quando il
 * backend li manda, valgono quelli.
 */

/** Le caselle di un Cielo: per ognuna la carta del catalogo, oppure `null`. */
export type SkySlots = Record<DeckSlot, number | null>

/** Ordine della tavola (due colonne): Sole e Marte, Luna e Giove, Saturno e Mercurio, Venere e Ascendente. */
export const SKY_LAYOUT: readonly DeckSlot[] = [
  'SOLE',
  'MARTE',
  'LUNA',
  'GIOVE',
  'SATURNO',
  'MERCURIO',
  'VENERE',
  'ASCENDANT',
]

/** Carte di elemento per Cielo (regolamento e engine: da 1 a 3 creature per elemento). */
export const ELEMENT_RANGE = { min: 1, max: 3 } as const

/** Elementi nell'ordine delle Fazioni. */
export const SKY_ELEMENTS: readonly Element[] = ['FIRE', 'WATER', 'EARTH', 'AIR']

/**
 * Le carte nelle caselle.
 *
 * @param slots Caselle.
 * @param catalog Catalogo.
 * @returns Per ogni casella la carta, oppure `null`.
 */
export function slotCards(
  slots: SkySlots,
  catalog: Catalog,
): Record<DeckSlot, CardDefinition | null> {
  return Object.fromEntries(
    DECK_SLOTS.map((slot) => [
      slot,
      slots[slot] === null ? null : (catalog.byId.get(slots[slot]) ?? null),
    ]),
  ) as Record<DeckSlot, CardDefinition | null>
}

/**
 * Quante creature per elemento (l'Ascendente non combatte e non conta).
 *
 * @param slots Caselle.
 * @param catalog Catalogo.
 * @returns Il conteggio per elemento.
 */
export function elementCounts(slots: SkySlots, catalog: Catalog): Record<Element, number> {
  const counts: Record<Element, number> = { FIRE: 0, WATER: 0, EARTH: 0, AIR: 0 }
  for (const slot of DECK_SLOTS) {
    if (slot === 'ASCENDANT') continue
    const card = slots[slot] === null ? undefined : catalog.byId.get(slots[slot])
    if (card) counts[card.element] += 1
  }
  return counts
}

/** Un avviso in anteprima, con quello che lo risolve. */
export type SkyWarning =
  | { kind: 'MISSING'; slots: DeckSlot[] }
  | { kind: 'ELEMENT_NONE'; element: Element }
  | { kind: 'ELEMENT_TOO_MANY'; element: Element; count: number }

/**
 * Gli avvisi del Cielo così com'è adesso: caselle vuote, poi elementi fuori da 1–3. Gli elementi
 * si controllano solo con tutte le creature in campo, altrimenti un Cielo a metà sembrerebbe
 * sempre sbagliato.
 *
 * @param slots Caselle.
 * @param catalog Catalogo.
 * @returns Gli avvisi, nell'ordine in cui conviene risolverli.
 */
export function skyWarnings(slots: SkySlots, catalog: Catalog): SkyWarning[] {
  const missing = DECK_SLOTS.filter((slot) => slots[slot] === null)
  const warnings: SkyWarning[] = missing.length > 0 ? [{ kind: 'MISSING', slots: missing }] : []
  const creaturesComplete = !missing.some((slot) => slot !== 'ASCENDANT')
  if (!creaturesComplete) return warnings
  const counts = elementCounts(slots, catalog)
  for (const element of SKY_ELEMENTS) {
    if (counts[element] < ELEMENT_RANGE.min) warnings.push({ kind: 'ELEMENT_NONE', element })
    else if (counts[element] > ELEMENT_RANGE.max)
      warnings.push({ kind: 'ELEMENT_TOO_MANY', element, count: counts[element] })
  }
  return warnings
}

/**
 * Le caselle sono uguali? (per "Modifiche non salvate").
 *
 * @param a Prime caselle.
 * @param b Seconde caselle.
 * @returns `true` se ogni casella ha la stessa carta.
 */
export function sameSlots(a: SkySlots, b: SkySlots): boolean {
  return DECK_SLOTS.every((slot) => a[slot] === b[slot])
}
