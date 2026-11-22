import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PATHS } from '@/app/paths'
import { GameCard } from '@/components/game/GameCard'
import { GoldButton } from '@/components/ui/GoldButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { useCatalog } from '@/features/cards/queries'
import { useCollection } from '@/features/collection/queries'

export function NewTradePage() {
  const navigate = useNavigate()
  const [offered, setOffered] = useState<number[]>([])
  const [requested, setRequested] = useState<number[]>([])
  const { cards } = useCatalog()
  const collection = useCollection()

  const tradable = cards.filter((card) => {
    const owned = collection.owned.get(card.id)
    return owned && owned.tradableCopies > 0
  })
  const toggle = (id: number, set: (ids: number[]) => void, ids: number[]) =>
    set(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])

  return (
    <div className="grid gap-8 lg:grid-cols-[24rem_minmax(0,1fr)]">
      <section className="glass rounded-lg p-5">
        <h2 className="mb-4 text-text type-h2-m">Scegli il giocatore</h2>
        <p className="text-text-muted type-body">
          Potrai cercare qui solo gli amici già presenti nella tua lista. La lista amici e le richieste
          di amicizia saranno disponibili quando verranno implementate.
        </p>
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-2">
        <div className="glass rounded-lg p-5">
          <h2 className="text-text type-h2-m">Offri</h2>
          <p className="mt-1 mb-4 text-text-muted type-meta">Scegli una o più carte dalla tua collezione.</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-3">
            {tradable.map((card) => (
              <GameCard
                key={card.id}
                size="fluid"
                imageUrl={card.imageUrl}
                label={card.name}
                aura={card.tier}
                selected={offered.includes(card.id)}
                onSelect={() => toggle(card.id, setOffered, offered)}
              />
            ))}
          </div>
        </div>

        <div className="glass rounded-lg p-5">
          <h2 className="text-text type-h2-m">Richiedi</h2>
          <p className="mt-1 mb-4 text-text-muted type-meta">Scegli cosa vorresti in cambio.</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-3">
            {cards.filter((card) => !offered.includes(card.id)).map((card) => (
              <GameCard
                key={card.id}
                size="fluid"
                imageUrl={card.imageUrl}
                label={card.name}
                aura={card.tier}
                selected={requested.includes(card.id)}
                onSelect={() => toggle(card.id, setRequested, requested)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end lg:col-span-2">
        <SecondaryButton onClick={() => navigate(PATHS.trades)}>Annulla</SecondaryButton>
        <GoldButton
          disabled
          onClick={() => navigate(PATHS.tradesSent)}
          className="sm:w-58"
        >
          Invia proposta
        </GoldButton>
      </div>
    </div>
  )
}
