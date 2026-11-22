import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Medallion } from '@/components/ui/Medallion'
import type { Faction } from '@/domain/game'
import { GOD_LABELS } from '@/domain/labels'
import { SKY_COPY } from '@/features/decks/messages'

const COPY = SKY_COPY.faction

/** Proprietà di {@link FactionBand}. */
export interface FactionBandProps {
  faction: Faction | null
  /** Creature del Cielo dell'elemento del Dio. */
  benefiting: number
}

/**
 * La Fazione nel Cielo (S07, sola lettura): il Dio, il suo effetto e quante carte del Cielo ne
 * beneficiano. La Fazione non si sceglie qui.
 */
export function FactionBand({ faction, benefiting }: FactionBandProps) {
  return (
    <TilePanel as="div" aria-label={COPY.title}>
      <div className="flex items-center gap-4 px-5 py-3">
        {faction && (
          <span aria-hidden="true" className="shrink-0">
            <Medallion size={40}>
              <ElementEmblem element={faction.element} size={34} />
            </Medallion>
          </span>
        )}
        <span className="flex flex-col gap-0.5">
          <span className="type-eyebrow tracking-[0.12em] text-gold uppercase">{COPY.title}</span>
          <span className="text-text type-meta">
            {faction ? (
              <>
                <b>{GOD_LABELS[faction.god].name}</b> · {GOD_LABELS[faction.god].effect} ·{' '}
                <span className="text-gold-bright">{COPY.benefit(benefiting)}</span>
              </>
            ) : (
              COPY.none
            )}
          </span>
        </span>
      </div>
    </TilePanel>
  )
}
