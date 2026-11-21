import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import type { PlanetCode } from '@/domain/game'
import { PLANET_LABELS, SIGN_GLYPHS, TIER_LABELS } from '@/domain/labels'
import { PLANET_TIER } from '@/domain/rules'
import type { CardDefinition } from '@/features/cards/types'
import { StatPills } from '@/features/decks/components/StatPills'
import { SKY_COPY } from '@/features/decks/messages'
import type { DeckSlot } from '@/features/decks/types'

const COPY = SKY_COPY.slot

/** Colore della rarità nel sopratitolo (token dei tier, versione testo). */
const TIER_TEXT = {
  COMMON: 'text-tier-comune-text',
  RARE: 'text-tier-rara-text',
  EPIC: 'text-tier-epica-text',
  LEGENDARY: 'text-tier-leggendaria-text',
  ASCENDANT: 'text-tier-ascendente-text',
} as const

/** Proprietà di {@link SkySlotTile}. */
export interface SkySlotTileProps {
  slot: DeckSlot
  card: CardDefinition | null
  /** Casella aperta nel selettore. */
  selected: boolean
  /** Per l'Ascendente: le carte del Cielo con il suo segno (ricevono +1 ATK, come nell'engine). */
  ascendantTargets?: string[]
  onSelect: () => void
}

/**
 * Una casella del Cielo (S07, tavola Collezione-Cielo): pianeta e rarità, la carta con segno,
 * ATK e DEF stampati e casa; per l'Ascendente, a quali carte dà il bonus. Vuota: "Scegli il
 * segno". Toccandola si apre il selettore di quella casella.
 */
export function SkySlotTile({
  slot,
  card,
  selected,
  ascendantTargets = [],
  onSelect,
}: SkySlotTileProps) {
  const isAscendant = slot === 'ASCENDANT'
  const tier = isAscendant ? 'ASCENDANT' : PLANET_TIER[slot as PlanetCode]
  const eyebrow = isAscendant
    ? COPY.ascendant
    : `${PLANET_LABELS[slot as PlanetCode]} · ${TIER_LABELS[tier]}`

  return (
    <TilePanel
      as="div"
      className={`h-full transition-[filter] ${selected ? '[filter:var(--za-glow-selected)]' : ''}`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onSelect}
        className="flex h-full w-full cursor-pointer items-center gap-4 border-0 bg-transparent p-3 text-left"
      >
        <span
          aria-hidden="true"
          className="flex h-[4.875rem] w-14 shrink-0 items-center justify-center overflow-hidden rounded-(--za-card-radius) bg-bg-deep/70 shadow-[inset_0_0_0_1px_rgba(232,176,75,0.35)]"
        >
          {card?.imageUrl ? (
            <img src={card.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <Icon name={isAscendant ? 'ascendente' : 'carta'} size={24} className="text-gold/60" />
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={`flex items-center gap-1.5 type-eyebrow tracking-[0.12em] uppercase ${TIER_TEXT[tier]}`}
          >
            <span aria-hidden="true" className="size-1.5 rotate-45 bg-current" />
            {eyebrow}
          </span>
          <span className="truncate font-display text-[1rem] font-bold text-text">
            {card ? (
              <>
                {card.name}{' '}
                <span aria-hidden="true" className="text-gold-bright">
                  {SIGN_GLYPHS[card.sign]}
                </span>
              </>
            ) : isAscendant ? (
              COPY.chooseAscendant
            ) : (
              COPY.choose
            )}
          </span>
          {card && !isAscendant && (
            <span className="flex flex-wrap items-center gap-2">
              <StatPills card={card} />
              {card.house && <span className="text-text-muted type-meta">Casa {card.house}</span>}
            </span>
          )}
          {card && isAscendant && (
            <span className="text-text-muted type-meta">
              {COPY.ascendantTargets(ascendantTargets)}
            </span>
          )}
        </span>
        {card ? (
          !isAscendant && (
            <span aria-hidden="true" className="self-start">
              <ElementEmblem element={card.element} size={20} />
            </span>
          )
        ) : (
          <Icon name="aggiungi" size={20} className="shrink-0 text-gold-bright" />
        )}
      </button>
    </TilePanel>
  )
}
