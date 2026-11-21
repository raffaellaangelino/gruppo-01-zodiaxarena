import { GameCard } from '@/components/game/GameCard'
import type { CollectionEntry } from '@/features/collection/types'

/** Proprietà di {@link CollectionTile}. */
export interface CollectionTileProps {
  entry: CollectionEntry
  /** Griglia filtrata: il nome sotto la carta (tavola Collezione-Filtrata). Nell'album no. */
  withName: boolean
  onOpen: () => void
}

/**
 * Una posizione dell'album (S05): la carta posseduta con "Nuova" e "×N", oppure la sagoma della
 * mancante con il numero di catalogo, così il giocatore sa cosa cercare. Toccandola si apre il
 * dettaglio.
 */
export function CollectionTile({ entry, withName, onOpen }: CollectionTileProps) {
  const { card, owned, number } = entry
  return (
    <li className="flex min-w-0 flex-col items-center gap-2">
      <GameCard
        size="fluid"
        imageUrl={card.imageUrl}
        label={card.name}
        missing={!owned}
        missingLabel={number}
        aura={card.tier}
        isNew={owned?.isNew ?? false}
        copies={owned?.quantity ?? 1}
        onSelect={onOpen}
      />
      {withName && (
        <span
          className={`leading-tight w-full text-center type-meta ${owned ? 'text-text type-meta-strong' : 'text-text-muted'}`}
        >
          {card.name}
        </span>
      )}
    </li>
  )
}
