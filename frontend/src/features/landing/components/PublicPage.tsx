import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { PublicBar } from '@/features/landing/components/PublicBar'
import { LegalFooter, type LegalFooterProps } from '@/features/legal/components/LegalFooter'

/** Proprietà di {@link PublicPage}. */
export interface PublicPageProps {
  /** La pagina, segnata come attiva nel piede. */
  current: NonNullable<LegalFooterProps['current']>
  children: ReactNode
}

/**
 * Guscio delle pagine di lettura pubbliche (Guida e Privacy), come nei siti dei giochi: la stessa
 * barra e lo stesso piede della landing, lo stesso cielo come sfondo. Si torna al sito dal logo,
 * dalle voci della barra o dal percorso sopra il titolo ({@link PublicTrail}).
 */
export function PublicPage({ current, children }: PublicPageProps) {
  return (
    <div className="public-shell flex min-h-dvh flex-col bg-scene-base text-text">
      <PublicBar />
      <div className="flex-1">{children}</div>
      <LegalFooter current={current} />
    </div>
  )
}

/**
 * Percorso sopra il titolo delle pagine pubbliche: "Zodiax Arena › Guida". Dice dove sei e riporta
 * alla landing (FOUNDATIONS: i collegamenti testuali hanno la ›).
 */
export function PublicTrail({ label }: { label: string }) {
  return (
    <nav aria-label="Percorso" className="mb-5">
      <ol className="flex items-center gap-2 type-label tracking-[0.14em] uppercase">
        <li>
          <Link to={PATHS.home} className="text-nav-ink no-underline hover:text-text">
            Zodiax Arena
          </Link>
        </li>
        <li aria-hidden="true" className="text-gold">
          ›
        </li>
        <li aria-current="page" className="text-gold-bright">
          {label}
        </li>
      </ol>
    </nav>
  )
}
