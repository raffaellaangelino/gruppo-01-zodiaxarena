import type { DeckDto } from '@/features/decks/dto'
import type { DeckSlot } from '@/features/decks/types'
import { catalogMock } from '@/mocks/catalog'

/** Cieli salvati durante la sessione con i dati di esempio (si perdono ricaricando). */
const SAVED = new Map<number, DeckDto>()

/** Il Cielo di esempio delle tavole ("Cielo di Fuoco"): segno di ogni casella. */
const SKY: Record<DeckSlot, string> = {
  SOLE: 'Leone',
  LUNA: 'Cancro',
  MARTE: 'Ariete',
  GIOVE: 'Sagittario',
  SATURNO: 'Capricorno',
  MERCURIO: 'Bilancia',
  VENERE: 'Toro',
  ASCENDANT: 'Leone',
}

/**
 * Mazzo di esempio, nella forma di `GET /api/decks/{id}`, con le carte del catalogo di esempio.
 *
 * @param id Id del mazzo.
 * @returns Il mazzo.
 */
export function deckMock(id: number): DeckDto {
  const saved = SAVED.get(id)
  if (saved) return saved
  const catalog = catalogMock()
  const slots = Object.fromEntries(
    (Object.entries(SKY) as [DeckSlot, string][]).map(([slot, sign]) => {
      const card = catalog.find((c) =>
        slot === 'ASCENDANT'
          ? c.type === 'ASCENDANT' && c.sign.name === sign
          : c.planet?.name.toUpperCase() === slot && c.sign.name === sign,
      )
      return [slot, card?.id ?? null]
    }),
  ) as Record<DeckSlot, number | null>
  return {
    id,
    name: 'Cielo di Fuoco',
    updatedAt: '2026-11-20T10:15:00Z',
    slots,
    valid: true,
    problems: [],
    elementBalance: { FIRE: 3, WATER: 1, EARTH: 2, AIR: 1 },
    effectiveStats: {},
  }
}

/**
 * Salvataggio di esempio (`PUT /api/decks/{id}`): tiene il Cielo in memoria e risponde come il
 * backend oggi, cioè sempre valido (le regole V1–V8 non sono ancora attive).
 *
 * @param id Mazzo.
 * @param body Nome e caselle.
 * @returns Il mazzo salvato.
 */
export function saveDeckMock(
  id: number,
  body: { name: string; slots: Record<DeckSlot, number | null> },
): DeckDto {
  const catalog = catalogMock()
  const balance: Record<string, number> = { FIRE: 0, WATER: 0, EARTH: 0, AIR: 0 }
  for (const [slot, cardId] of Object.entries(body.slots)) {
    const card = catalog.find((c) => c.id === cardId)
    if (card && slot !== 'ASCENDANT') balance[card.sign.type] = (balance[card.sign.type] ?? 0) + 1
  }
  const deck: DeckDto = {
    ...deckMock(id),
    name: body.name,
    slots: body.slots,
    updatedAt: new Date().toISOString(),
    elementBalance: balance,
  }
  SAVED.set(id, deck)
  return deck
}
