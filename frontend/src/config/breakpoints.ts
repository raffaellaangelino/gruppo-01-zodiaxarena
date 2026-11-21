/**
 * Media query dei breakpoint, per il codice TypeScript (in Tailwind si usano i prefissi
 * `md:`, `xl:`…). Devono restare uguali a quelli di `styles/theme.css`.
 */
export const MEDIA = {
  /** Desktop con la barra di gioco (xl, 1280 px). Sotto: intestazione e barra in basso. */
  desktop: '(width >= 80rem)',
  /** Schermi larghi (2xl, 1440 px): la misura delle tavole desktop. */
  wide: '(width >= 90rem)',
} as const
