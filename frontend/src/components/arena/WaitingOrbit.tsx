import type { CSSProperties } from 'react'
import './WaitingOrbit.css'

/** Proprietà di {@link WaitingOrbit}. */
export interface WaitingOrbitProps {
  /** Cosa sta succedendo, per gli screen reader (es. "Lyra contro Maia: la partita si sta preparando"). */
  label: string
  className?: string
}

/** Semiassi dell'orbita (gen_ar.attesa: 120 × 26) e lunghezza approssimata dell'ellisse (Ramanujan). */
const RX = 120
const RY = 26
const PERIMETER = Math.PI * (3 * (RX + RY) - Math.sqrt((3 * RX + RY) * (RX + 3 * RY)))
const LIGHT = 56

/**
 * Attesa nell'arena (tavola Sfide-Attesa): un'orbita distesa sul pavimento tra i due giocatori,
 * con un punto di luce che la percorre, e il "VS" sopra. Con "riduci movimento" la luce sta ferma.
 */
export function WaitingOrbit({ label, className = '' }: WaitingOrbitProps) {
  return (
    <span className={`block ${className}`}>
      <span className="sr-only">{label}</span>
      <svg
        aria-hidden="true"
        width={RX * 2 + 8}
        height={140}
        viewBox={`${-RX - 4} -100 ${RX * 2 + 8} 140`}
        className="overflow-visible"
      >
        <text
          x={0}
          y={-56}
          textAnchor="middle"
          dominantBaseline="central"
          className="waiting-orbit__vs"
        >
          VS
        </text>
        <ellipse rx={RX} ry={RY} fill="none" stroke="var(--za-line)" strokeOpacity={0.65} />
        <ellipse
          rx={RX}
          ry={RY}
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={`${LIGHT} ${(PERIMETER - LIGHT).toFixed(0)}`}
          className="waiting-orbit__light"
          style={{ '--orbit-length': `${PERIMETER.toFixed(0)}px` } as CSSProperties}
        />
      </svg>
    </span>
  )
}
