import { useId } from 'react'
import type { Progress } from '@/domain/game'
import { starPath } from '@/lib/svgStar'

/** Proprietà di {@link Constellation}. */
export interface ConstellationProps {
  /** Quanti fatti su quanti (sotto le 10 unità: missioni, sfide premiate). */
  progress: Progress
  /** Larghezza in px (92 nella scena, 52 nella Banda, 46 nelle Tessere mobile). */
  width: number
}

/**
 * Costellazione (FOUNDATIONS §6b-bis): ogni unità è una stella. Quelle fatte si accendono
 * e si collegano con un filo, la prossima è un anello che pulsa piano, le altre sono punti.
 * Decorativa: il numero va sempre scritto accanto ("2 di 5").
 */
export function Constellation({ progress: { done, total }, width }: ConstellationProps) {
  const glowId = useId()
  const y = 10
  const xs = Array.from({ length: total }, (_, k) =>
    total > 1 ? 8 + ((width - 16) * k) / (total - 1) : 8,
  )
  const starR = total <= 5 ? 5.2 : 4.4

  return (
    <svg
      width={width}
      height={20}
      viewBox={`0 0 ${width} 20`}
      aria-hidden="true"
      focusable="false"
      className="block shrink-0 overflow-visible"
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0" style={{ stopColor: 'var(--za-clasp-light)', stopOpacity: 0.75 }} />
          <stop offset="1" style={{ stopColor: 'var(--za-clasp-light)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      {xs.slice(0, -1).map((x, k) => {
        const lit = k + 1 < done
        return (
          <line
            key={`l${k}`}
            x1={x}
            y1={y}
            x2={xs[k + 1]}
            y2={y}
            stroke={lit ? 'var(--za-card-gold-mid)' : 'var(--za-line-soft)'}
            strokeWidth={lit ? 1.6 : 1}
          />
        )
      })}
      {xs.map((x, k) => {
        if (k < done)
          return (
            <g key={k}>
              <circle cx={x} cy={y} r={7} fill={`url(#${glowId})`} />
              <path d={starPath(x, y, starR)} fill="var(--za-card-gold-light)" />
            </g>
          )
        if (k === done)
          return (
            <circle
              key={k}
              className="animate-next motion-reduce:animate-none"
              cx={x}
              cy={y}
              r={total <= 5 ? 4 : 3.4}
              fill="var(--za-medallion-core)"
              stroke="var(--za-gold-bright)"
              strokeWidth={1.2}
            />
          )
        return <circle key={k} cx={x} cy={y} r={2} fill="var(--za-text-disabled)" />
      })}
    </svg>
  )
}
