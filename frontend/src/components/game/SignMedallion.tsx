import { Medallion } from '@/components/ui/Medallion'
import type { SignCode } from '@/domain/game'
import { SIGN_GLYPHS } from '@/domain/labels'

/** Proprietà di {@link SignMedallion}. */
export interface SignMedallionProps {
  sign: SignCode
  /** Diametro: `l` = 88 px (scena della registrazione), `m` = 56 px (riepilogo su mobile). */
  size: 'l' | 'm'
  className?: string
}

const SIZES = {
  l: { px: 88, glyph: 'text-[3rem]' },
  m: { px: 56, glyph: 'text-[1.875rem]' },
} as const

/**
 * Medaglione del segno: il glifo dello zodiaco d'oro chiaro nel disco blu notte con l'anello
 * delle carte. Decorativo: il nome del segno è sempre scritto accanto.
 */
export function SignMedallion({ sign, size, className = '' }: SignMedallionProps) {
  const { px, glyph } = SIZES[size]
  return (
    <span aria-hidden="true" className={className}>
      <Medallion size={px} variant={size === 'l' ? 'large' : 'medallion'}>
        <span className={`font-symbol leading-none text-nav-ink-active ${glyph}`}>
          {SIGN_GLYPHS[sign]}
        </span>
      </Medallion>
    </span>
  )
}
