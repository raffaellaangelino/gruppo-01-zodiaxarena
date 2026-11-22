import { GameCard } from '@/components/game/GameCard'
import type { CardDefinition } from '@/features/cards/types'

export function TradeCardStrip({
  cards,
  label,
}: {
  cards: CardDefinition[]
  label: string
}) {
  return (
    <section aria-label={label} className="flex min-w-0 flex-col gap-3">
      <h3 className="type-eyebrow tracking-[0.12em] text-gold uppercase">{label}</h3>
      <div className="flex flex-wrap gap-3">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col items-center gap-2">
            <GameCard
              size="m"
              imageUrl={card.imageUrl}
              label={card.name}
              aura={card.tier}
              copies={1}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
