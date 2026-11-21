import cardBackUrl from '@/assets/cards/dorso.webp'
import type { CardThumb } from '@/domain/game'

/** Dorso standard delle carte (design/art/asset/dorsi). */
export const CARD_BACK = cardBackUrl

/**
 * Carte coperte, per mostrare quante carte arriveranno senza dire quali
 * (es. il primo cielo prima della registrazione: le carte si scoprono dopo).
 *
 * @param count Quante carte.
 * @returns Le miniature, tutte con il dorso.
 */
export function faceDownCards(count: number): CardThumb[] {
  return Array.from({ length: count }, (_, i) => ({ id: i, code: 'DORSO', imageUrl: CARD_BACK }))
}
