import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { Logo } from '@/components/brand/Logo'

/** Proprietà di {@link LegalFooter}. */
export interface LegalFooterProps {
  /** La pagina in cui si trova il piede, segnata come attiva. */
  current?: 'rules' | 'privacy'
}

const LINKS = [
  { key: 'rules', to: PATHS.rules, label: 'Guida' },
  { key: 'privacy', to: PATHS.privacy, label: 'Privacy' },
] as const

/**
 * Piede delle pagine pubbliche (FOUNDATIONS §6b-undecies). In alto il doppio filo d'oro, specchio
 * della barra: la pagina è incorniciata come un palcoscenico. Logo, le pagine pubbliche che esistono
 * (Termini, Cookie e Chi siamo arriveranno quando il team le scrive: finché non ci sono non si
 * mostrano, perché un nome che sembra un collegamento e non porta da nessuna parte inganna) e il
 * copyright.
 */
export function LegalFooter({ current }: LegalFooterProps) {
  return (
    <footer className="relative z-1 flex-none bg-bg-deep/80 backdrop-blur-glass">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-(image:--za-edge-gold-h)"
      />
      <span aria-hidden="true" className="absolute inset-x-0 top-1.5 h-px bg-edge-thin" />
      <div className="mx-auto flex max-w-[90rem] flex-col items-center gap-5 px-4 pt-9 pb-8 md:flex-row md:gap-10 xl:px-8">
        <Logo height={40} />
        <nav aria-label="Pagine del sito" className="flex gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              aria-current={current === link.key ? 'page' : undefined}
              className="type-label tracking-[0.14em] text-nav-ink uppercase no-underline transition-colors duration-(--za-dur-fast) hover:text-text aria-[current=page]:text-nav-ink-active"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-text-muted type-caption md:ml-auto">© 2026 Zodiax Arena</p>
      </div>
    </footer>
  )
}
