import { COLLECTION_COPY } from '@/features/collection/messages'
import type { Collection } from '@/features/collection/types'

const COPY = COLLECTION_COPY.progress

/**
 * Avanzamento della Collezione (tavola Collezione, in alto a destra): "Carte 13 / 84", un filo
 * d'oro con la stella sulla punta, "Ascendenti 2 / 12". Il filo segue le Creature, il traguardo
 * principale dell'album.
 */
export function CollectionProgress({ progress }: Pick<Collection, 'progress'>) {
  const { creatures, ascendants } = progress
  const ratio = creatures.total > 0 ? Math.min(1, creatures.done / creatures.total) : 0
  return (
    <div className="flex w-full max-w-[25rem] items-center gap-4 text-text-muted type-meta">
      <p className="shrink-0">
        <span className="sr-only">
          {COPY.label(creatures.done, creatures.total, COPY.creatures)}
        </span>
        <span aria-hidden="true">
          {COPY.creatures}{' '}
          <b className="text-text tabular-nums type-body-strong">{creatures.done}</b> /{' '}
          {creatures.total}
        </span>
      </p>
      <span aria-hidden="true" className="relative h-px min-w-12 flex-1 bg-line-soft">
        <span
          className="absolute inset-y-0 left-0 bg-(image:--za-edge-gold-h)"
          style={{ width: `${ratio * 100}%` }}
        />
        <span
          className="absolute top-1/2 size-2.5 -translate-1/2 rotate-45 bg-(--za-clasp-light) shadow-[0_0_8px_rgba(255,214,107,0.7)]"
          style={{ left: `${ratio * 100}%` }}
        />
      </span>
      <p className="shrink-0">
        <span className="sr-only">
          {COPY.label(ascendants.done, ascendants.total, COPY.ascendants)}
        </span>
        <span aria-hidden="true">
          {COPY.ascendants}{' '}
          <b className="text-text tabular-nums type-body-strong">{ascendants.done}</b> /{' '}
          {ascendants.total}
        </span>
      </p>
    </div>
  )
}
