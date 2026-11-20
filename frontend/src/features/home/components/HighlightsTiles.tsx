import { Link } from 'react-router'
import { TilePanel } from '@/components/panels/TilePanel'
import type { Highlight } from '@/features/home/highlights'

/** Proprietà di {@link HighlightsTiles}. */
export interface HighlightsTilesProps {
  highlights: Highlight[]
}

/**
 * Tessere 2×2 della Home mobile (FOUNDATIONS §6b-ter): stessa anatomia della Banda desktop
 * (visuale, categoria, titolo, una riga di stato), una Tessera in vetro per ciascuna.
 */
export function HighlightsTiles({ highlights }: HighlightsTilesProps) {
  return (
    <ul aria-label="Il tuo riepilogo" className="grid grid-cols-2 gap-3">
      {highlights.map((h) => (
        <li key={h.key}>
          <TilePanel glass as="div" className="h-41">
            <Link
              to={h.to}
              aria-label={h.ariaLabel}
              className="flex h-full flex-col gap-2 px-4 pt-4 pb-3 text-text"
            >
              <span className="flex h-13 items-center">{h.visual}</span>
              <span className="type-label text-gold">{h.category}</span>
              <span className="type-h3-compact">{h.title}</span>
              <span className="flex flex-wrap items-center gap-1 text-text-muted type-row-meta">
                {h.status}
              </span>
            </Link>
          </TilePanel>
        </li>
      ))}
    </ul>
  )
}
