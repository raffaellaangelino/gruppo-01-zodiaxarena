import { useId, type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react'
import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link TextField}. */
export interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  /** Etichetta visibile sopra il campo (obbligatoria: niente campi senza nome). */
  label: string
  /** Messaggio d'errore sotto il campo; rende il campo non valido. */
  error?: string
  /**
   * Campo non valido senza messaggio proprio: per esempio quando l'errore è uno solo
   * per tutto il modulo (credenziali errate) e sta sopra i campi.
   */
  invalid?: boolean
  /** Contenuto a destra dentro il campo (es. "Mostra" nella password). */
  suffix?: ReactNode
  /** Riferimento all'`<input>`, per spostare il focus. */
  inputRef?: Ref<HTMLInputElement>
}

/**
 * Campo di testo del design system: etichetta sopra, campo a filo (raggio 8, altezza 44),
 * errore sotto il campo con l'icona (FOUNDATIONS §6b-decies, tavole Accedi e Registrati).
 *
 * Gestisce da solo gli attributi di accessibilità: etichetta collegata, `aria-invalid`,
 * `aria-describedby` verso il messaggio d'errore.
 *
 * @example <TextField label="Email" type="email" autoComplete="email" error={errors.email} />
 */
export function TextField({
  label,
  error,
  invalid = false,
  suffix,
  inputRef,
  id,
  className = '',
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-errore`
  const isInvalid = invalid || !!error

  const ring = isInvalid
    ? 'inset-ring-2 inset-ring-field-border-error'
    : 'inset-ring inset-ring-field-border focus-within:inset-ring-2 focus-within:inset-ring-field-border-focus'

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={inputId} className="text-text-soft type-meta-strong">
        {label}
      </label>
      <div className={`flex h-11 items-center gap-2 rounded-control bg-field-bg px-4 ${ring}`}>
        {/* Il focus lo mostra il bordo d'oro del campo (focus-within), non l'anello globale */}
        <input
          ref={inputRef}
          id={inputId}
          aria-invalid={isInvalid || undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-text shadow-none outline-none type-body"
          {...inputProps}
        />
        {suffix}
        {isInvalid && <Icon name="avviso" size={18} className="text-danger-soft" />}
      </div>
      {error && (
        <p id={errorId} className="flex items-center gap-2 text-danger-soft type-caption">
          <Icon name="avviso" size={14} />
          {error}
        </p>
      )}
    </div>
  )
}
