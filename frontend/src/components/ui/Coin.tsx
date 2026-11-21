import { useId } from 'react'

/** Proprietà di {@link Coin}. */
export interface CoinProps {
  /** Lato in px (20 nella barra desktop, 18 su mobile). */
  size: number
}

/**
 * Moneta dei crediti: cerchio d'oro con l'anello e la stella incisa. Decorativa:
 * il numero dei crediti è sempre scritto accanto.
 */
export function Coin({ size }: CoinProps) {
  const ring = useId()
  const face = useId()
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ring} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--za-card-gold-light)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--za-card-gold-mid)' }} />
          <stop offset="1" style={{ stopColor: 'var(--za-card-gold-dark)' }} />
        </linearGradient>
        <linearGradient id={face} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--za-coin-face-light)' }} />
          <stop offset="1" style={{ stopColor: 'var(--za-coin-face-dark)' }} />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10.6" fill="var(--za-medallion-core)" />
      <circle cx="12" cy="12" r="9.8" fill={`url(#${ring})`} />
      <circle
        cx="12"
        cy="12"
        r="6.8"
        fill={`url(#${face})`}
        stroke="var(--za-coin-engrave)"
        strokeWidth=".5"
      />
      <path
        d="M12 7.6 L13.15 10.85 L16.4 12 L13.15 13.15 L12 16.4 L10.85 13.15 L7.6 12 L10.85 10.85 Z"
        fill="var(--za-coin-engrave)"
      />
    </svg>
  )
}
