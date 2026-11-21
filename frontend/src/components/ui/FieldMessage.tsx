import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link FieldMessage}. */
export interface FieldMessageProps {
  /** Id a cui punta `aria-describedby` del campo. */
  id: string
  /** `error`: rosso con l'avviso · `success`: verde con la spunta · `neutral`: testo attenuato. */
  tone: 'error' | 'success' | 'neutral'
  children: ReactNode
}

const TONES = {
  error: { color: 'text-danger-soft', icon: 'avviso' },
  success: { color: 'text-success', icon: 'conferma' },
  neutral: { color: 'text-text-muted', icon: null },
} as const

/**
 * Riga sotto un campo del modulo (testo 12): l'errore, la conferma o un'indicazione.
 * È la stessa per campi di testo, selettori e caselle, così tutti i moduli parlano allo stesso modo.
 */
export function FieldMessage({ id, tone, children }: FieldMessageProps) {
  const { color, icon } = TONES[tone]
  return (
    <p id={id} className={`flex items-center gap-2 type-caption ${color}`}>
      {icon && <Icon name={icon} size={14} className="shrink-0" />}
      <span>{children}</span>
    </p>
  )
}
