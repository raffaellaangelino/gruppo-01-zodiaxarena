import { Link } from 'react-router'
import { BandPanel } from '@/components/panels/BandPanel'
import type { Highlight } from '@/features/home/highlights'

/** Proprietà di {@link HighlightsBand}. */
export interface HighlightsBandProps {
  highlights: Highlight[]
  className?: string
}

/**
 * Banda in fondo alla Home desktop: Il tuo Cielo (più largo, per il ventaglio), Missioni,
 * Pacchetti, Fazione. Tutta la cella è cliccabile, senza frecce (FOUNDATIONS §6b-quinquies).
 */
export function HighlightsBand({ highlights, className = '' }: HighlightsBandProps) {
  return (
    <BandPanel aria-label="Il tuo riepilogo" className={className}>
      <div className="flex h-full items-center">
        {highlights.map((h, i) => (
          <Link
            key={h.key}
            to={h.to}
            aria-label={h.ariaLabel}
            className={`flex h-full min-w-0 items-center px-4.5 text-text ${h.key === 'deck' ? 'flex-[1.35] gap-4' : 'flex-1 gap-3'} ${i > 0 ? 'border-l border-divider-band' : ''}`}
          >
            {h.visual}
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="type-label text-gold">{h.category}</span>
              <span className="truncate type-h3-compact">{h.title}</span>
              <span className="flex items-center gap-2 whitespace-nowrap text-text-muted type-row-meta">
                {h.status}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </BandPanel>
  )
}
