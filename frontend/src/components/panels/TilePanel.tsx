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
  className?: string
}

/** Raggio dell'incavo (14), distanza del filo interno (6), raggio dell'arco interno (20). */
const R = 14
const D = 6
const RI = R + D
const E = Math.sqrt(RI * RI - D * D)
const CORNER = RI + 4

const CORNERS = [
  { key: 'tl', style: { top: 0, left: 0 } },
  { key: 'tr', style: { top: 0, right: 0, transform: 'scaleX(-1)' } },
  { key: 'bl', style: { bottom: 0, left: 0, transform: 'scaleY(-1)' } },
  { key: 'br', style: { bottom: 0, right: 0, transform: 'scale(-1, -1)' } },
] as const

/**
 * Tessera del design system: pannello con la doppia riga d'oro e gli angoli a incavo.
 * È il contenitore dei blocchi di contenuto ("Ti aspettano", le Tessere della Home mobile).
 */
export function TilePanel({
  children,
  glass = false,
  as: Tag = 'section',
  className = '',
  ...aria
}: TilePanelProps) {
  return (
    <Tag className={`tile-panel ${className}`} {...aria}>
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
            d={`M${R} 1 A${R - 1} ${R - 1} 0 0 1 1 ${R}`}
            fill="none"
            stroke="var(--za-gold-bright)"
            strokeWidth={2}
          />
          <path
            d={`M${E.toFixed(1)} ${D} A${RI} ${RI} 0 0 1 ${D} ${E.toFixed(1)}`}
            fill="none"
            stroke="var(--za-line-thin)"
            strokeWidth={1}
          />
        </svg>
      ))}
    </Tag>
  )
}
