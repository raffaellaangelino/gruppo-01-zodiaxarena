import { useId } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import type { Progress } from '@/domain/game'
import { starPath } from '@/lib/svgStar'

/** Proprietà di {@link Meridian}. */
export interface MeridianProps {
  /** Avanzamento verso il traguardo (es. pacchetti aperti verso il Sole garantito). */
  progress: Progress
  /** Diametro in px (50 nella Banda, 46 nelle Tessere mobile). */
  size: number
  /** Icona del premio al centro (predefinita `sole`). */
  icon?: IconName
}

/**
 * Meridiana (FOUNDATIONS §6b-bis): anello graduato attorno all'icona del premio; l'arco d'oro
 * cresce, una stellina ne segna la punta, una tacca per unità. Decorativa: il numero
 * ("Sole entro 4") va scritto accanto.
 */
export function Meridian({ progress: { done, total }, size, icon = 'sole' }: MeridianProps) {
  const arcId = useId()
  const c = size / 2
  const r = size / 2 - 6
  const angle = (k: number) => ((-90 + (360 * k) / total) * Math.PI) / 180
  const point = (radius: number, k: number) => [
    c + radius * Math.cos(angle(k)),
    c + radius * Math.sin(angle(k)),
  ]
  const [ex, ey] = point(r, done)
  const complete = done >= total

  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 overflow-visible"
      >
        <defs>
          <linearGradient id={arcId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--za-btn-gold-center)' }} />
            <stop offset="1" style={{ stopColor: 'var(--za-btn-gold-side)' }} />
          </linearGradient>
        </defs>
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="var(--za-medallion-core)"
          stroke="var(--za-line-soft)"
          strokeWidth={3.5}
        />
        {Array.from({ length: total }, (_, k) => {
          const [x1, y1] = point(r + 4, k)
          const [x2, y2] = point(r + 7, k)
          return (
            <line
              key={k}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={k < done ? 'var(--za-btn-gold-center)' : 'var(--za-text-disabled)'}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
          )
        })}
        {complete && (
          <circle cx={c} cy={c} r={r} fill="none" stroke={`url(#${arcId})`} strokeWidth={3.5} />
        )}
        {done > 0 && !complete && (
          <>
            <path
              d={`M${c} ${c - r} A${r} ${r} 0 ${done / total > 0.5 ? 1 : 0} 1 ${ex.toFixed(2)} ${ey.toFixed(2)}`}
              fill="none"
              stroke={`url(#${arcId})`}
              strokeWidth={3.5}
              strokeLinecap="round"
            />
            <path d={starPath(ex, ey, 4.2)} fill="var(--za-card-gold-light)" />
          </>
        )}
      </svg>
      <span className="relative m-auto text-tier-leggendaria-text">
        <Icon name={icon} size={24} active={complete} />
      </span>
    </span>
  )
}
