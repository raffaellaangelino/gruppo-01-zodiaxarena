import type { CollectionDto } from '@/features/collection/dto'
import { catalogMock } from '@/mocks/catalog'

/**
 * Le carte possedute nella collezione di esempio (come nella tavola Collezione: Lyra, Fuoco), per
 * codice dell'immagine: quante copie, se sono nel Cielo, se sono nuove.
 */
const OWNED: Record<string, { quantity: number; inDeck?: boolean; isNew?: boolean }> = {
  'za-001-sole-ariete': { quantity: 1 },
  'za-002-sole-toro': { quantity: 2 },
  'za-005-sole-leone': { quantity: 1, inDeck: true },
  'za-007-sole-bilancia': { quantity: 1, isNew: true },
  'za-009-sole-sagittario': { quantity: 1 },
  'za-012-sole-pesci': { quantity: 1 },
  'za-016-luna-cancro': { quantity: 1, inDeck: true },
  'za-024-luna-pesci': { quantity: 2 },
  'za-025-marte-ariete': { quantity: 3, inDeck: true },
  'za-045-giove-sagittario': { quantity: 1, inDeck: true },
  'za-058-saturno-capricorno': { quantity: 1, inDeck: true },
  'za-067-mercurio-bilancia': { quantity: 1, inDeck: true },
  'za-074-venere-toro': { quantity: 1, inDeck: true },
  'za-asc-05-ascendente-leone': { quantity: 1, inDeck: true },
  'za-asc-02-ascendente-toro': { quantity: 1 },
}

/**
 * Collezione di esempio, nella forma di `GET /api/collection`, con le carte del catalogo di esempio.
 *
 * @returns La collezione.
 */
export function collectionMock(): CollectionDto {
  const catalog = catalogMock()
  const cards = catalog
    .map((card) => ({ card, owned: OWNED[card.imgId.replace(/\.png$/, '')] }))
    .filter((x) => x.owned)
    .map(({ card, owned }) => ({
      cardId: card.id,
      quantity: owned.quantity,
      tradableCopies: Math.max(0, owned.quantity - (owned.inDeck ? 1 : 0)),
      inDeck: owned.inDeck ?? false,
      inOpenTrade: false,
      isNew: owned.isNew ?? false,
      starter: false,
      obtainedAt: null,
    }))
  const isCreature = (id: number) => catalog.find((c) => c.id === id)?.type === 'CREATURE'
  const copies = cards.reduce((sum, c) => sum + Math.max(0, c.quantity - 1), 0)
  return {
    progress: {
      creatures: { done: cards.filter((c) => isCreature(c.cardId)).length, total: 84 },
      ascendants: { done: cards.filter((c) => !isCreature(c.cardId)).length, total: 12 },
    },
    duplicates: { copies, recycleValue: 0 },
    cards,
  }
}
