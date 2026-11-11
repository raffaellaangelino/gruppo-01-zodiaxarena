import logoUrl from '@/assets/images/logo.webp'

/** Proporzione dell'immagine del logo (536 × 160). */
const LOGO_RATIO = 536 / 160

/** Proprietà di {@link Logo}. */
export interface LogoProps {
  /** Altezza in px: 52 nella colonna d'accesso, 40 nella barra, 32 su mobile (FOUNDATIONS §6b). */
  height: number
  /** Classi Tailwind per la posizione. */
  className?: string
}

/**
 * Logo di Zodiax Arena (concept Flow rifinito; il definitivo vettoriale è la Q-16).
 * È solo marchio: non è cliccabile.
 */
export function Logo({ height, className }: LogoProps) {
  return (
    <img
      src={logoUrl}
      alt="Zodiax Arena"
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      className={className}
    />
  )
}
