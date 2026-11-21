/** Proprietà di {@link Badge}. */
export interface BadgeProps {
  /** Numero da mostrare. */
  count: number
  /**
   * `nav`: sulle voci della barra e sui titoli (18 px, oro chiaro).
   * `bell`: sulla campanella (15 px, oro delle carte).
   */
  variant?: 'nav' | 'bell'
  /** Classi Tailwind per la posizione. */
  className?: string
}

/**
 * Contatore a pillola. È decorativo: il numero va detto anche nel testo accessibile
 * dell'elemento che lo porta (es. `aria-label="Sfide, 2 da giocare"`).
 */
export function Badge({ count, variant = 'nav', className = '' }: BadgeProps) {
  const look =
    variant === 'nav'
      ? 'h-4.5 min-w-4.5 px-1.5 bg-gold-bright'
      : 'h-3.75 min-w-3.75 px-1 bg-card-gold-mid'
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-pill text-bg type-badge ${look} ${className}`}
    >
      {count}
    </span>
  )
}
