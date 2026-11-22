import type { Element, PlanetCode, SignCode, Tier } from '@/domain/game'
import { ELEMENT_LABELS, PLANET_LABELS, SIGN_LABELS, TIER_LABELS } from '@/domain/labels'
import { PLANET_TIER } from '@/domain/rules'
import type { CardDefinition } from '@/features/cards/types'
import type { Collection, CollectionEntry } from '@/features/collection/types'

/**
 * L'album della Collezione (S05, tavole Collezione e Collezione-Filtrata): tutte le posizioni del
 * catalogo nell'ordine ufficiale (pianeta → segno, 001–084, poi gli Ascendenti), i gruppi per
 * pianeta e i filtri. Solo letture: nessuna regola del gioco rifatta qui.
 */

/** Pianeti nell'ordine del catalogo (dal Leggendario al Comune). */
export const PLANET_ORDER: readonly PlanetCode[] = [
  'SOLE',
  'LUNA',
  'MARTE',
  'GIOVE',
  'SATURNO',
  'MERCURIO',
  'VENERE',
]

/** Segni nell'ordine dello zodiaco (colonne dell'album). */
export const SIGN_ORDER: readonly SignCode[] = Object.keys(SIGN_LABELS) as SignCode[]

/** Elementi nell'ordine delle Fazioni (Fuoco, Acqua, Terra, Aria). */
export const ELEMENT_ORDER: readonly Element[] = ['FIRE', 'WATER', 'EARTH', 'AIR']

/** Rarità dalla più comune all'Ascendente (tavola: i rombi della rarità). */
export const TIER_ORDER: readonly Tier[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ASCENDANT']

/**
 * Numero di catalogo dal codice dell'immagine: `za-005-sole-leone` → 5 e "005";
 * `za-asc-05-ascendente-leone` → 85 e "A05" (gli Ascendenti vengono dopo le 84 Creature).
 */
function catalogNumber(card: CardDefinition): { order: number; number: string } {
  const creature = /^za-(\d{3})-/.exec(card.code)
  if (creature) return { order: Number(creature[1]), number: creature[1] }
  const ascendant = /^za-asc-(\d{2})-/.exec(card.code)
  if (ascendant) return { order: 84 + Number(ascendant[1]), number: `A${ascendant[1]}` }
  // Codice inatteso: in fondo, nell'ordine dell'id, senza inventare un numero.
  return { order: 1000 + card.id, number: '—' }
}

/**
 * Tutte le posizioni dell'album, nell'ordine del catalogo.
 *
 * @param cards Catalogo.
 * @param collection Collezione del giocatore.
 * @returns Una posizione per carta.
 */
export function toEntries(cards: CardDefinition[], collection: Collection): CollectionEntry[] {
  return cards
    .map((card) => ({ card, ...catalogNumber(card), owned: collection.owned.get(card.id) ?? null }))
    .sort((a, b) => a.order - b.order)
}

/** Un gruppo dell'album: un pianeta (12 segni) oppure gli Ascendenti. */
export interface AlbumGroup {
  key: PlanetCode | 'ASCENDANT'
  title: string
  tier: Tier
  entries: CollectionEntry[]
  owned: number
}

/**
 * L'album diviso per pianeta, poi gli Ascendenti.
 *
 * @param entries Posizioni (già nell'ordine del catalogo).
 * @returns I gruppi non vuoti.
 */
export function albumGroups(entries: CollectionEntry[]): AlbumGroup[] {
  const groups: Omit<AlbumGroup, 'owned'>[] = [
    ...PLANET_ORDER.map((planet) => ({
      key: planet,
      title: PLANET_LABELS[planet],
      tier: PLANET_TIER[planet],
      entries: entries.filter((e) => e.card.planet === planet),
    })),
    {
      key: 'ASCENDANT' as const,
      title: 'Ascendenti',
      tier: 'ASCENDANT' as const,
      entries: entries.filter((e) => e.card.type === 'ASCENDANT'),
    },
  ]
  return groups
    .filter((g) => g.entries.length > 0)
    .map((g) => ({ ...g, owned: g.entries.filter((e) => e.owned).length }))
}

/** Stato di una carta per il filtro "Altri filtri · Stato". */
export type EntryState = 'ALL' | 'DUPLICATE' | 'NEW' | 'MISSING'

/** I filtri della Collezione. */
export interface CollectionFilters {
  elements: Element[]
  tiers: Tier[]
  sign: SignCode | null
  state: EntryState
  onlyOwned: boolean
}

/** Nessun filtro: l'album completo. */
export const NO_FILTERS: CollectionFilters = {
  elements: [],
  tiers: [],
  sign: null,
  state: 'ALL',
  onlyOwned: false,
}

/** Etichette degli stati. */
export const STATE_LABELS: Record<EntryState, string> = {
  ALL: 'Tutte',
  DUPLICATE: 'Doppie',
  NEW: 'Nuove',
  MISSING: 'Mancanti',
}

/**
 * C'è almeno un filtro attivo? Allora la tavola mostra la griglia con i nomi, non l'album.
 *
 * @param f Filtri.
 * @returns `true` se qualcosa restringe la lista.
 */
export function isFiltered(f: CollectionFilters): boolean {
  return (
    f.elements.length > 0 ||
    f.tiers.length > 0 ||
    f.sign !== null ||
    f.state !== 'ALL' ||
    f.onlyOwned
  )
}

/**
 * Le posizioni che passano i filtri.
 *
 * @param entries Posizioni.
 * @param f Filtri.
 * @returns Le posizioni rimaste, nello stesso ordine.
 */
export function applyFilters(entries: CollectionEntry[], f: CollectionFilters): CollectionEntry[] {
  return entries.filter((e) => {
    if (f.elements.length > 0 && !f.elements.includes(e.card.element)) return false
    if (f.tiers.length > 0 && !f.tiers.includes(e.card.tier)) return false
    if (f.sign && e.card.sign !== f.sign) return false
    if (f.onlyOwned && !e.owned) return false
    if (f.state === 'DUPLICATE' && (e.owned?.quantity ?? 0) < 2) return false
    if (f.state === 'NEW' && !e.owned?.isNew) return false
    if (f.state === 'MISSING' && e.owned) return false
    return true
  })
}

/** Un filtro attivo, come chip rimovibile. */
export interface FilterChip {
  key: string
  label: string
  /** I filtri senza questo. */
  without: CollectionFilters
}

/**
 * I filtri attivi come chip (tavola Collezione-Filtrata: "Fuoco ×", "Stato: nuove ×").
 *
 * @param f Filtri.
 * @returns Un chip per filtro.
 */
export function filterChips(f: CollectionFilters): FilterChip[] {
  return [
    ...f.elements.map((el) => ({
      key: `el-${el}`,
      label: ELEMENT_LABELS[el],
      without: { ...f, elements: f.elements.filter((x) => x !== el) },
    })),
    ...f.tiers.map((t) => ({
      key: `tier-${t}`,
      label: TIER_LABELS[t],
      without: { ...f, tiers: f.tiers.filter((x) => x !== t) },
    })),
    ...(f.sign ? [{ key: 'sign', label: SIGN_LABELS[f.sign], without: { ...f, sign: null } }] : []),
    ...(f.state !== 'ALL'
      ? [
          {
            key: 'state',
            label: `Stato: ${STATE_LABELS[f.state].toLowerCase()}`,
            without: { ...f, state: 'ALL' as const },
          },
        ]
      : []),
    ...(f.onlyOwned
      ? [{ key: 'owned', label: 'Solo possedute', without: { ...f, onlyOwned: false } }]
      : []),
  ]
}
