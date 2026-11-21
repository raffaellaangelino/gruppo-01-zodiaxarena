import { useId } from 'react'
import { starPath } from '@/lib/svgStar'
import './LoadingConstellation.css'

/** Proprietà di {@link LoadingConstellation}. */
export interface LoadingConstellationProps {
  /** Larghezza in px (le stelle sono sempre cinque). */
  width?: number
}

/** Numero di stelle e ritardo tra l'una e l'altra. */
const STARS = 5
const STEP_S = 0.2

/**
 * Indicatore di attesa nel linguaggio del gioco: una costellazione le cui stelle si accendono
 * una dopo l'altra (al posto della rotella generica). Decorativo: chi lo usa annuncia
 * l'attesa a parole (es. `role="status"`).
 */
export function LoadingConstellation({ width = 140 }: LoadingConstellationProps) {
  const glowId = useId()
  const y = 12
  const xs = Array.from({ length: STARS }, (_, k) => 10 + ((width - 20) * k) / (STARS - 1))
  return (
    <svg
      width={width}
      height={24}
      viewBox={`0 0 ${width} 24`}
      aria-hidden="true"
      focusable="false"
      className="block overflow-visible"
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0" style={{ stopColor: 'var(--za-clasp-light)', stopOpacity: 0.75 }} />
          <stop offset="1" style={{ stopColor: 'var(--za-clasp-light)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <line x1={xs[0]} y1={y} x2={xs[STARS - 1]} y2={y} stroke="var(--za-line)" strokeWidth={1} />
      {xs.map((x, i) => (
        <g
          key={i}
          className="loading-constellation__star"
          style={{ animationDelay: `${i * STEP_S}s` }}
        >
          <circle cx={x} cy={y} r={9} fill={`url(#${glowId})`} />
          <path d={starPath(x, y, 6)} fill="var(--za-card-gold-light)" />
        </g>
      ))}
    </svg>
  )
}
