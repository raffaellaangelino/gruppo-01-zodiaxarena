import { useCatalog } from '@/features/cards/queries'
import type { MatchCard } from '@/features/matches/types'

/**
 * L'illustrazione di una carta della partita: l'engine la nomina per segno e pianeta, il
 * catalogo dà l'immagine.
 *
 * @param card Carta della partita.
 * @returns L'indirizzo dell'immagine, oppure `null` se nel catalogo non c'è (si mostra il dorso).
 */
export function useMatchCardImage(card: MatchCard): string | null {
  const { cards } = useCatalog()
  const found = cards.find(
    (c) =>
      c.sign === card.sign &&
      c.planet === card.planet &&
      (card.planet !== null || c.type === 'ASCENDANT'),
  )
  return found?.imageUrl ?? null
}
