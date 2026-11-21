import { CARD_BACK } from '@/components/game/cardBack'
import type { CardThumb } from '@/domain/game'
import type { CardDefinition } from '@/features/cards/types'

/**
 * Miniatura di una carta del catalogo, per i ventagli; senza illustrazione si vede il dorso.
 *
 * @param card Carta del catalogo.
 * @returns La miniatura.
 */
export function cardThumb(card: CardDefinition): CardThumb {
  return { id: card.id, code: card.code, imageUrl: card.imageUrl ?? CARD_BACK }
}
