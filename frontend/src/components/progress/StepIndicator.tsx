import { Fragment } from 'react'

/** Proprietà di {@link StepIndicator}. */
export interface StepIndicatorProps {
  /** Nomi dei passi, nell'ordine. */
  steps: readonly string[]
  /** Indice del passo in corso (da 0). */
  current: number
  className?: string
}

/**
 * Passi di un percorso breve (tavole Registrati): un rombo per passo unito da un filo.
 * Passo in corso: rombo e nome nell'oro della voce attiva (come nella barra di gioco). Passi fatti: rombo pieno, filo d'oro verso il successivo.
 * Passi da fare: rombo vuoto, nome attenuato.
 */
export function StepIndicator({ steps, current, className = '' }: StepIndicatorProps) {
  return (
    <ol aria-label="Passi" className={`flex items-center gap-3 ${className}`}>
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <Fragment key={label}>
            <li
              aria-current={active ? 'step' : undefined}
              className={`flex shrink-0 items-center gap-2 tracking-[0.06em] type-badge ${active ? 'text-nav-ink-active' : done ? 'text-text' : 'text-text-muted'}`}
            >
              <span
                aria-hidden="true"
                className={`rotate-45 ${active ? 'size-2.5' : 'size-2'} ${done || active ? 'bg-nav-ink-active' : 'inset-ring inset-ring-gold-bright/50'}`}
              />
              {label}
              {done && <span className="sr-only"> (fatto)</span>}
            </li>
            {i < steps.length - 1 && (
              <li
                aria-hidden="true"
                className={`h-px min-w-4 flex-1 ${done ? 'bg-gold/60' : 'bg-text/20'}`}
              />
            )}
          </Fragment>
        )
      })}
    </ol>
  )
}
