import type { ReactNode } from 'react'
import { Link } from 'react-router'
import logoUrl from '@/assets/images/logo.webp'

/** Proporzione del logo colorato usato nelle barre (400 × 185). */
const BAR_LOGO_RATIO = 400 / 185

/** Proprietà delle cornici della barra. */
export interface BarFrameProps {
  /** Quello che sta dopo il logo: voci, crediti, profilo, inviti. */
  children: ReactNode
  /**
   * Dove porta il logo. Nel gioco il logo è solo marchio (FOUNDATIONS §6b: alla Home si va dalla
   * voce Home); sulle pagine pubbliche riporta alla landing, come in ogni sito.
   */
  logoTo?: string
}

/** Il logo, cliccabile solo se ha una destinazione. */
function BarLogo({ height, to, className }: { height: number; to?: string; className?: string }) {
  const logo = (
    <img
      src={logoUrl}
      alt="Zodiax Arena"
      width={Math.round(height * BAR_LOGO_RATIO)}
      height={height}
      className={to ? undefined : className}
    />
  )
  if (!to) return logo
  return (
    <Link to={to} aria-label="Zodiax Arena, torna all'inizio" className={`flex ${className ?? ''}`}>
      {logo}
    </Link>
  )
}

/**
 * Cornice della barra desktop (FOUNDATIONS §6b, D-021): vetro dritto alto 64 con il doppio filo
 * d'oro e il logo a sinistra. La usano la barra di gioco e la barra delle pagine pubbliche, così
 * il sito e il gioco hanno la stessa testata; cambia solo quello che ci sta dentro.
 */
export function DesktopBarFrame({ children, logoTo }: BarFrameProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-37.5 bg-(image:--za-bar-shade)"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--za-bar-fill) backdrop-blur-glass"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-0.5 bg-(image:--za-edge-gold-h)"
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-14.5 h-px bg-edge-thin" />

      <div className="relative flex h-14.5 items-stretch pr-5.5 pl-8">
        <BarLogo height={40} to={logoTo} className="self-center" />
        {children}
      </div>
    </header>
  )
}

/**
 * Cornice dell'intestazione mobile (FOUNDATIONS §6b-ter): specchio della barra desktop, alta 56
 * più l'area sicura, con il logo a sinistra.
 */
export function MobileBarFrame({ children, logoTo }: BarFrameProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-safe">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--za-bar-fill-m) backdrop-blur-glass"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-0.5 bg-(image:--za-edge-gold-h)"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-1.5 h-px bg-edge-thin" />

      <div className="relative flex h-14 items-center justify-between pr-3 pl-4">
        <BarLogo height={32} to={logoTo} />
        {children}
      </div>
    </header>
  )
}
