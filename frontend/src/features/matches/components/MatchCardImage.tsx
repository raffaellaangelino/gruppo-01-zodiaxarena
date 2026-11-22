import { GameCard, type GameCardProps } from '@/components/game/GameCard'
import { useMatchCardImage } from '@/features/matches/hooks/useMatchCardImage'
import type { MatchCard } from '@/features/matches/types'

/** Proprietà di {@link MatchCardImage}. */
export interface MatchCardImageProps {
  card: MatchCard
  size?: GameCardProps['size']
}

/** Una carta della partita con la sua illustrazione. Se nel catalogo non c'è, si vede il dorso. */
export function MatchCardImage({ card, size = 'xs' }: MatchCardImageProps) {
  return <GameCard imageUrl={useMatchCardImage(card)} label={card.name} size={size} />
}
