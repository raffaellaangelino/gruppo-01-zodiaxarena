import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link FormAlert}. */
export interface FormAlertProps {
  /** Testo del messaggio: dice cosa è successo e cosa fare. */
  children: ReactNode
}

/**
 * Errore che riguarda tutto il modulo (es. credenziali errate), sopra i campi.
 * Viene annunciato subito dagli screen reader (`role="alert"`).
 */
export function FormAlert({ children }: FormAlertProps) {
  return (
    <div role="alert" className="flex items-start gap-2 text-danger-soft type-meta">
      <Icon name="avviso" size={18} />
      <span>{children}</span>
    </div>
  )
}
