import { GameCard, type GameCardProps } from '@/components/game/GameCard'
import { useCatalog } from '@/features/cards/queries'
import type { MatchCard } from '@/features/matches/types'

/** Proprietà di {@link MatchCardImage}. */
export interface MatchCardImageProps {
  card: MatchCard
  size?: GameCardProps['size']
}

/**
 * Una carta della partita con la sua illustrazione: l'engine la nomina per segno e pianeta, il
 * catalogo dà l'immagine. Se nel catalogo non c'è, si vede il dorso.
 */
export function MatchCardImage({ card, size = 'xs' }: MatchCardImageProps) {
  const { cards } = useCatalog()
  const found = cards.find(
    (c) =>
      c.sign === card.sign &&
      c.planet === card.planet &&
      (card.planet !== null || c.type === 'ASCENDANT'),
  )
  return <GameCard imageUrl={found?.imageUrl ?? null} label={card.name} size={size} />
}
