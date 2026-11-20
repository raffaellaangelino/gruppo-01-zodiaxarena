import { useId } from 'react'

/** Proprietà di {@link GoldClasp}. */
export interface GoldClaspProps {
  /** Lato del fermaglio in px (22 nella barra e nella colonna d'accesso). */
  size?: number
  /** Classi Tailwind per la posizione. */
  className?: string
}

/**
 * Fermaglio a rombo con la stella: segna la voce attiva sul doppio filo d'oro della barra
 * e il centro del bordo della colonna d'accesso. Decorativo.
 */
export function GoldClasp({ size = 22, className }: GoldClaspProps) {
  const gradientId = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="-11 -11 22 22"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="-10"
          x2="0"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" style={{ stopColor: 'var(--za-clasp-light)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--za-clasp-shine)' }} />
          <stop offset="1" style={{ stopColor: 'var(--za-clasp-dark)' }} />
        </linearGradient>
      </defs>
      <path
        d="M0 -9.9 L9.9 0 L0 9.9 L-9.9 0 Z"
        fill="var(--za-bg)"
        stroke={`url(#${gradientId})`}
        strokeWidth={1.6}
        strokeLinejoin="miter"
      />
      <path
        d="M0 -5.6 L1.5 -1.5 L5.6 0 L1.5 1.5 L0 5.6 L-1.5 1.5 L-5.6 0 L-1.5 -1.5 Z"
        fill="var(--za-clasp-light)"
      />
    </svg>
  )
}
