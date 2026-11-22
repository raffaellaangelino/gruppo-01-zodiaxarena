import type { ReactNode } from 'react'
import './TilePanel.css'

/** Proprietà di {@link TilePanel}. */
export interface TilePanelProps {
  children: ReactNode
  /**
   * Vetro (blu notte trasparente e sfocato): solo quando dietro c'è un'illustrazione,
   * come nella Home (FOUNDATIONS §4b). Senza, il pannello è pieno.
   */
  glass?: boolean
  /** Elemento HTML del pannello (predefinito `section`). */
  as?: 'section' | 'div' | 'article'
  /** Nome accessibile del pannello, se non ha un titolo visibile collegato. */
  'aria-label'?: string
  /**
   * `tile`: Tessera (incavo 14, filo 2), il contenitore dei blocchi di contenuto. `row`: Riga
   * (incavo 9, filo 1.5), per un elemento in riga fuori dai pannelli: un avviso, una richiesta.
   */
  variant?: 'tile' | 'row'
  /** Solo per la Riga: rombo con stella sul bordo sinistro, quando c'è qualcosa da fare o da sapere. */
  mark?: boolean
  className?: string
}

/** Misure per variante: raggio dell'incavo, distanza del filo interno, filo esterno. */
const GEOMETRY = {
  tile: { r: 14, d: 6, w: 2 },
  row: { r: 9, d: 4, w: 1.5 },
} as const

const CORNERS = [
  { key: 'tl', style: { top: 0, left: 0 } },
  { key: 'tr', style: { top: 0, right: 0, transform: 'scaleX(-1)' } },
  { key: 'bl', style: { bottom: 0, left: 0, transform: 'scaleY(-1)' } },
  { key: 'br', style: { bottom: 0, right: 0, transform: 'scale(-1, -1)' } },
] as const

/**
 * Tessera del design system: pannello con la doppia riga d'oro e gli angoli a incavo.
 * È il contenitore dei blocchi di contenuto ("Ti aspettano", le Tessere della Home mobile).
 * Con `variant="row"` è la Riga, la stessa forma in piccolo (gen_a.notch_frame 9 · 4 · 1.5).
 */
export function TilePanel({
  children,
  glass = false,
  as: Tag = 'section',
  variant = 'tile',
  mark = false,
  className = '',
  ...aria
}: TilePanelProps) {
  const { r: R, d: D, w: W } = GEOMETRY[variant]
  const RI = R + D
  const E = Math.sqrt(RI * RI - D * D)
  const CORNER = RI + 4
  return (
    <Tag
      className={`tile-panel ${variant === 'row' ? 'tile-panel--row' : ''} ${className}`}
      {...aria}
    >
      <div aria-hidden="true" className={`tile-panel__fill ${glass ? 'glass' : ''}`} />
      <div className="tile-panel__content">{children}</div>
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <span
          key={side}
          aria-hidden="true"
          className={`tile-panel__edge tile-panel__edge--${side}`}
        />
      ))}
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <span
          key={side}
          aria-hidden="true"
          className={`tile-panel__thin tile-panel__thin--${side}`}
        />
      ))}
      {CORNERS.map(({ key, style }) => (
        <svg
          key={key}
          aria-hidden="true"
          focusable="false"
          className="tile-panel__corner"
          width={CORNER}
          height={CORNER}
          viewBox={`0 0 ${CORNER} ${CORNER}`}
          style={style}
        >
          <path
            d={`M${R} ${W / 2} A${R - W / 2} ${R - W / 2} 0 0 1 ${W / 2} ${R}`}
            fill="none"
            stroke="var(--za-gold-bright)"
            strokeWidth={W}
          />
          <path
            d={`M${E.toFixed(1)} ${D} A${RI} ${RI} 0 0 1 ${D} ${E.toFixed(1)}`}
            fill="none"
            stroke="var(--za-line-thin)"
            strokeWidth={1}
          />
        </svg>
      ))}
      {mark && (
        <svg
          aria-hidden="true"
          focusable="false"
          className="tile-panel__mark"
          width={18}
          height={18}
          viewBox="0 0 18 18"
        >
          <rect
            x={3.5}
            y={3.5}
            width={11}
            height={11}
            transform="rotate(45 9 9)"
            fill="var(--za-bg)"
            stroke="var(--za-gold-bright)"
            strokeWidth={1.4}
          />
          <path
            d="M9 5.6 L9.8 8.2 L12.4 9 L9.8 9.8 L9 12.4 L8.2 9.8 L5.6 9 L8.2 8.2 Z"
            fill="var(--za-gold-bright)"
          />
        </svg>
      )}
    </Tag>
  )
}
