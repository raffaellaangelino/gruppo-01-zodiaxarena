import logoUrl from '@/assets/images/logo.webp'

/** Proporzione dell'immagine del logo (400 × 185). */
const LOGO_RATIO = 400 / 185

/** Proprietà di {@link Logo}. */
export interface LogoProps {
  /** Altezza in px: 52 nella colonna d'accesso, 40 nella barra, 32 su mobile (FOUNDATIONS §6b). */
  height: number
  /** Classi Tailwind per la posizione. */
  className?: string
}

/**
 * Logo compatto del team (D-030), per intestazioni e barre. Il simbolo dedicato sotto i 250 px
 * non c'è ancora (Q-43): finché manca si usa il compatto. È solo marchio: non è cliccabile.
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
