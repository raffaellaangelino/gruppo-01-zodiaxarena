import type { ReactNode } from 'react'

/** Proprietà di {@link Pill}. */
export interface PillProps {
  /**
   * `gold`: oro pieno, testo scuro (novità: "Nuova").
   * `outline`: blu notte con il filo d'oro (copie "×2", "Proposta dal tuo segno").
   * `muted`: blu notte con il filo chiaro, testo attenuato (contesto: "Nel mazzo", "Mancante").
   */
  tone?: 'gold' | 'outline' | 'muted'
  /** Segno davanti al testo (es. la scintilla della novità). */
  icon?: ReactNode
  children: ReactNode
  className?: string
}

const TONES = {
  gold: 'bg-(image:--za-btn-gold) text-bg',
  outline: 'bg-bg/90 text-gold-bright inset-ring inset-ring-gold',
  muted: 'bg-bg/90 text-text-muted inset-ring inset-ring-text/25',
} as const

/**
 * Etichetta a pillola (altezza 20, testo 12 in maiuscolo): segna uno stato sopra una carta
 * o una Tessera (gen_c.pill). Decorativa per chi legge con lo screen reader quando lo stato
 * è già detto nel nome accessibile dell'elemento che la porta.
 */
export function Pill({ tone = 'outline', icon, children, className = '' }: PillProps) {
  return (
    <span
      className={`inline-flex h-5 items-center gap-1 rounded-pill px-2 tracking-[0.06em] whitespace-nowrap uppercase type-badge ${TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}
