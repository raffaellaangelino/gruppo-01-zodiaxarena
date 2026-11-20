import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { ApiError } from '@/lib/http'
import { hasNoErrors } from '@/lib/validation'
import type { LoginCredentials, LoginFailure } from '@/features/auth/types'
import { useAuth } from '@/features/auth/useAuth'
import { validateLogin } from '@/features/auth/validation'

type Field = keyof LoginCredentials

/** Proprietà da passare a un campo del modulo d'accesso. */
export interface LoginFieldProps {
  name: Field
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  error?: string
  invalid: boolean
}

/**
 * Traduce l'errore di una chiamata nel motivo da mostrare al giocatore.
 *
 * @param error Errore lanciato dall'accesso.
 * @returns Il motivo: credenziali, rete o server.
 */
function toLoginFailure(error: unknown): LoginFailure {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'credentials'
    if (error.isNetworkError) return 'network'
  }
  return 'server'
}

/**
 * Stato e comportamento del modulo d'accesso, separati dalla grafica.
 *
 * - Il pulsante è attivo solo se i dati sono validi (FOUNDATIONS §6b-decies).
 * - L'errore di un campo compare quando lo si lascia, e solo se c'è scritto qualcosa:
 *   un campo vuoto non viene segnalato, basta il pulsante spento.
 * - Con le credenziali errate, entrambi i campi diventano rossi e il focus va alla password.
 * - Scrivere di nuovo toglie il messaggio d'errore del modulo.
 *
 * @returns Le proprietà dei campi, l'invio e lo stato del modulo.
 */
export function useLoginForm() {
  const { login } = useAuth()
  const [values, setValues] = useState<LoginCredentials>({ email: '', password: '' })
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [failure, setFailure] = useState<LoginFailure | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const passwordRef = useRef<HTMLInputElement>(null)

  const errors = useMemo(() => validateLogin(values), [values])
  const isValid = hasNoErrors(errors)

  /**
   * @param name Campo del modulo.
   * @returns Valore, eventi ed errori da passare al campo.
   */
  const fieldProps = (name: Field): LoginFieldProps => ({
    name,
    value: values[name],
    onChange: (event) => {
      const { value } = event.target
      setValues((prev) => ({ ...prev, [name]: value }))
      setFailure(null)
    },
    onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    error: touched[name] && values[name] !== '' ? errors[name] : undefined,
    invalid: failure === 'credentials',
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid || submitting) return
    setSubmitting(true)
    setFailure(null)
    try {
      await login({ email: values.email.trim(), password: values.password })
      // Riuscito: la sessione è aperta e la pagina cambia da sola (GuestOnly).
    } catch (error) {
      const reason = toLoginFailure(error)
      setFailure(reason)
      setSubmitting(false)
      if (reason === 'credentials') {
        passwordRef.current?.focus()
        passwordRef.current?.select()
      }
    }
  }

  return { fieldProps, handleSubmit, isValid, submitting, failure, passwordRef }
}
