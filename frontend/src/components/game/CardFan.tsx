import type { CardThumb } from '@/domain/game'

/** Proprietà di {@link CardFan}. */
export interface CardFanProps {
  cards: CardThumb[]
  /** Larghezza di una carta in px (40 nella Banda, 34 nelle Tessere mobile); l'altezza segue la proporzione 5:7. */
  cardWidth: number
  /** Spostamento tra una carta e la successiva, in px. */
  step: number
  /** Rotazione tra carte vicine, in gradi (3 nella Banda). */
  tilt?: number
}

/**
 * Le carte di un mazzo aperte a ventaglio (la mano dei giochi di carte), per mostrare
 * un Cielo a colpo d'occhio. Decorativo: il nome del mazzo è scritto accanto.
 */
export function CardFan({ cards, cardWidth, step, tilt = 3 }: CardFanProps) {
  const cardHeight = Math.round((cardWidth * 7) / 5)
  const middle = (cards.length - 1) / 2
  return (
    <span
      aria-hidden="true"
      className="relative block shrink-0"
      style={{ width: step * (cards.length - 1) + cardWidth, height: cardHeight + 4 }}
    >
      {cards.map((card, i) => (
        <img
          key={card.id}
          src={card.imageUrl}
          alt=""
          width={cardWidth}
          height={cardHeight}
          className="absolute bottom-0 aspect-card origin-bottom rounded-thumb object-cover shadow-card-thumb"
          style={{ left: i * step, transform: `rotate(${(i - middle) * tilt}deg)` }}
        />
      ))}
    </span>
  )
}
