import type { DeckDto } from '@/features/decks/dto'
import type { DeckSlot } from '@/features/decks/types'
import { catalogMock } from '@/mocks/catalog'

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
