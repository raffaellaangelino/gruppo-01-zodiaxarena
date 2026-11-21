import { TilePanel } from '@/components/panels/TilePanel'
import { Badge } from '@/components/ui/Badge'
import { LineTitle } from '@/components/ui/LineTitle'
import { TertiaryLink } from '@/components/ui/TertiaryButton'
import type { WaitingItem } from '@/features/home/types'
import { toWaitingItemView } from '@/features/home/waitingItemView'

/** Proprietà di {@link WaitingPanel}. */
export interface WaitingPanelProps {
  items: WaitingItem[]
  /** Mobile: testi brevi e pulsanti più alti (36). */
  compact: boolean
  className?: string
}

/**
 * "Ti aspettano" (FOUNDATIONS §6c): sfide ricevute, replay da guardare, scambi ricevuti,
 * ognuno con la sua azione. Tessera in vetro sopra la key art. Se è vuoto non si mostra.
 */
export function WaitingPanel({ items, compact, className = '' }: WaitingPanelProps) {
  return (
    <TilePanel glass className={className}>
      <div className={`pt-4 pb-2 ${compact ? 'px-4' : 'px-5'}`}>
        <div className="mb-2 flex items-center gap-3">
          <LineTitle textClassName={compact ? 'type-panel-title-m' : 'type-panel-title'}>
            Ti aspettano
          </LineTitle>
          <Badge count={items.length} />
          <span className="sr-only">{items.length} cose da fare</span>
        </div>

        <ul>
          {items.map((item) => {
            const view = toWaitingItemView(item, compact)
            return (
              <li
                key={item.id}
                className="relative flex items-center gap-3 border-t border-line-soft py-3 pl-4"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 left-0 size-1.75 -translate-y-1/2 rotate-45 bg-gold-bright"
                />
                <div className="min-w-0 flex-1">
                  <p className="type-label text-gold">{view.category}</p>
                  <p className="mt-0.5 type-row">{view.text}</p>
                  <p className="text-text-muted type-row-meta">{view.meta}</p>
                </div>
                <TertiaryLink
                  to={view.action.to}
                  icon={view.action.icon}
                  size={compact ? 'm' : 's'}
                  aria-label={view.action.ariaLabel}
                >
                  {view.action.label}
                </TertiaryLink>
              </li>
            )
          })}
        </ul>
      </div>
    </TilePanel>
  )
}
