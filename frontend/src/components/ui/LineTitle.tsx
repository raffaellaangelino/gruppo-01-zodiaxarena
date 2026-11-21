import type { ReactNode } from 'react'

/** Proprietà di {@link LineTitle}. */
export interface LineTitleProps {
  /** Testo del titolo. */
  children: ReactNode
  /** Livello del titolo nella pagina (predefinito h2). */
  as?: 'h2' | 'h3'
  /** Classi per la misura del testo (predefinita `type-panel-title`, 16 px). */
  textClassName?: string
  /**
   * Il filo si allunga fino al bordo (`true`) oppure il titolo occupa solo il suo spazio e il
   * rombo sta subito dopo il testo, come in "Ti aspettano" (predefinito `false`).
   */
  stretch?: boolean
}

/**
 * Titolo con linea (FOUNDATIONS §6b-quater): stella, testo, filo che sfuma e finisce
 * con un rombo. Per i titoli dei pannelli, come "Ti aspettano".
 */
export function LineTitle({
  children,
  as: Tag = 'h2',
  textClassName = 'type-panel-title',
  stretch = false,
}: LineTitleProps) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${stretch ? 'flex-1' : ''}`}>
      <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
        <path
          d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
          fill="var(--za-gold-bright)"
        />
      </svg>
      <Tag className={`shrink-0 text-gold-bright ${textClassName}`}>{children}</Tag>
      <span aria-hidden="true" className="h-px flex-1 bg-(image:--za-line-title)" />
      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 border border-gold" />
    </div>
  )
}
