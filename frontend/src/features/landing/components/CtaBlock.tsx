import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { Coin } from '@/components/ui/Coin'
import { GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { LANDING_COPY } from '@/features/landing/messages'
import { AUTH_ENABLED } from '@/config/env'

const COPY = LANDING_COPY

/** Proprietà di {@link CtaBlock}. */
export interface CtaBlockProps {
  /** Testo del pulsante eroico. */
  label: string
  /** Sotto, "Hai già un account? Accedi ›" (in chiusura; in apertura l'accesso è nella barra). */
  withLogin?: boolean
}

/**
 * L'invito a giocare, uguale in apertura e in chiusura: il pulsante eroico e, subito sotto, cosa si
 * riceve, ognuno con il suo segno (il Sole, la carta, la Moneta dei crediti). Lo schema dei giochi:
 * un'azione sola, con accanto la promessa concreta.
 */
export function CtaBlock({ label, withLogin = false }: CtaBlockProps) {
  const icons = [
    <Icon key="sole" name="sole" size={16} className="text-gold-bright" />,
    <Icon key="carte" name="mazzo" size={16} className="text-gold-bright" />,
    <Coin key="crediti" size={16} />,
  ]
  return (
    <div className="flex w-full flex-col items-center gap-4">
      {AUTH_ENABLED && (
        <GoldLink hero size="l" to={PATHS.register} className="w-full max-w-80">
          {label}
        </GoldLink>
      )}
      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
        <span className="type-label tracking-[0.14em] text-gold uppercase">{COPY.gifts.label}</span>
        <span aria-hidden="true" className="hidden h-3 w-px bg-line-soft md:block" />
        <ul aria-label={COPY.gifts.label} className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {COPY.gifts.items.map((item, i) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-text text-shadow-scene type-meta"
            >
              <span aria-hidden="true" className="flex">
                {icons[i]}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      {AUTH_ENABLED && withLogin && (
        <p className="mt-1 text-text-soft type-meta">
          {COPY.hero.hasAccount}{' '}
          <Link to={PATHS.login} className="text-gold-bright type-meta-strong">
            {COPY.hero.login} ›
          </Link>
        </p>
      )}
    </div>
  )
}
