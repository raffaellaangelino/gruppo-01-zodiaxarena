import type { ReactNode } from 'react'

/** Proprietà di {@link Medallion}. */
export interface MedallionProps {
  /** Diametro in px (50 nella Banda, 46 nelle Tessere mobile, 32–34 per l'avatar). */
  size: number
  /**
   * `medallion`: disco blu notte con il doppio anello d'oro (Banda, Tessere).
   * `avatar`: anello più sottile, per il profilo nella barra.
   * `large`: anello più spesso, per i medaglioni grandi in scena (il segno nella registrazione).
   */
  variant?: 'medallion' | 'avatar' | 'large'
  /** Contenuto al centro: un'icona o uno stemma. */
  children: ReactNode
  className?: string
}

/** Medaglione tondo con l'anello d'oro delle carte: cornice per icone e stemmi. */
export function Medallion({
  size,
  variant = 'medallion',
  children,
  className = '',
}: MedallionProps) {
  const look = {
    medallion: 'bg-(image:--za-medallion-fill) shadow-medallion',
    large: 'bg-(image:--za-medallion-fill) shadow-medallion-l',
    avatar: 'bg-medallion-core shadow-avatar',
  }[variant]
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full ${look} ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  )
}
