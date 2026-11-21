import type { ReactNode } from 'react'

/** Proprietà di {@link BandPanel}. */
export interface BandPanelProps {
  children: ReactNode
  /** Nome accessibile della striscia. */
  'aria-label'?: string
  className?: string
}

/** Rombi d'oro alle quattro estremità dei fili. */
const DIAMONDS = [
  '-top-1.25 left-0',
  '-top-1.25 right-0',
  '-bottom-1.25 left-0',
  '-bottom-1.25 right-0',
]

/**
 * Banda del design system: striscia di consultazione in vetro, con il doppio filo d'oro
 * solo sopra e sotto, aperta ai lati, e un rombo a ogni estremità (FOUNDATIONS §4).
 * Nella Home raccoglie Il tuo Cielo, Missioni, Pacchetti e Fazione.
 */
export function BandPanel({ children, className = '', ...aria }: BandPanelProps) {
  return (
    <section className={`relative glass ${className}`} {...aria}>
      <div className="relative h-full">{children}</div>
      {(['top-0', 'bottom-0'] as const).map((edge) => (
        <span key={edge} aria-hidden="true">
          <span className={`absolute inset-x-2.5 ${edge} z-2 h-0.5 bg-(image:--za-gold-line-h)`} />
          <span
            className={`absolute inset-x-6 z-2 h-px bg-line-thin ${edge === 'top-0' ? 'top-1.5' : 'bottom-1.5'}`}
          />
        </span>
      ))}
      {DIAMONDS.map((pos) => (
        <svg
          key={pos}
          aria-hidden="true"
          focusable="false"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`absolute z-3 ${pos}`}
        >
          <rect
            x="2.5"
            y="2.5"
            width="7"
            height="7"
            transform="rotate(45 6 6)"
            fill="var(--za-gold-bright)"
          />
        </svg>
      ))}
    </section>
  )
}
