/** Proprietà di {@link Spark}. */
export interface SparkProps {
  /** Lato in px (10 nelle pillole). */
  size?: number
  className?: string
}

/**
 * Scintilla a quattro punte: il segno della novità (carta nuova, proposta di Ermes).
 * Nel colore del testo. Decorativa.
 */
export function Spark({ size = 10, className }: SparkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M8 1 L9.4 6.6 L15 8 L9.4 9.4 L8 15 L6.6 9.4 L1 8 L6.6 6.6 Z" fill="currentColor" />
    </svg>
  )
}
