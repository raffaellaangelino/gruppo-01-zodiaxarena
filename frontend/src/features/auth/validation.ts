import { isEmail, type FieldErrors } from '@/lib/validation'
import type { LoginCredentials } from '@/features/auth/types'

/**
 * Controlla il modulo d'accesso lato client (requisito del brief), prima di chiamare il backend.
 *
 * @param values Email e password scritte.
 * @returns I messaggi per i campi non validi; oggetto vuoto se il modulo è valido.
 */
export function validateLogin(values: LoginCredentials): FieldErrors<LoginCredentials> {
  const errors: FieldErrors<LoginCredentials> = {}
  if (!values.email.trim()) errors.email = "Scrivi l'email del tuo account."
  else if (!isEmail(values.email))
    errors.email = "Controlla l'email: manca qualcosa (es. nome@esempio.it)."
  if (!values.password) errors.password = 'Scrivi la password.'
  return errors
}
