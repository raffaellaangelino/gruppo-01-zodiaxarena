import { useId, type ComponentPropsWithoutRef, type ReactNode, type Ref } from 'react'
import { FieldMessage } from '@/components/ui/FieldMessage'
import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link TextField}. */
export interface TextFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  /** Etichetta visibile sopra il campo (obbligatoria: niente campi senza nome). */
  label: string
  /** Messaggio d'errore sotto il campo; rende il campo non valido. Vince su `hint`. */
  error?: ReactNode
  /**
   * Campo non valido senza messaggio proprio: per esempio quando l'errore è uno solo
   * per tutto il modulo (credenziali errate) e sta sopra i campi.
   */
  invalid?: boolean
  /** Indicazione sotto il campo (es. le regole della password); verde se il campo è valido. */
  hint?: ReactNode
  /** Valore controllato e accettato: bordo e indicazione verdi, spunta nel campo (tavola Registrati). */
  valid?: boolean
  /** Contenuto a destra dentro il campo (es. "Mostra" nella password). */
  suffix?: ReactNode
  /** Riferimento all'`<input>`, per spostare il focus. */
  inputRef?: Ref<HTMLInputElement>
}

/**
 * Campo di testo del design system: etichetta sopra, campo a filo (raggio 8, altezza 44),
 * errore o indicazione sotto il campo con l'icona (FOUNDATIONS §6b-decies, tavole Accedi e Registrati).
 *
 * Gestisce da solo gli attributi di accessibilità: etichetta collegata, `aria-invalid`,
 * `aria-describedby` verso il messaggio sotto il campo.
 *
 * @example <TextField label="Email" type="email" autoComplete="email" error={errors.email} />
 */
export function TextField({
  label,
  error,
  invalid = false,
  hint,
  valid = false,
  suffix,
  inputRef,
  id,
  className = '',
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-messaggio`
  const isInvalid = invalid || !!error
  const isValid = valid && !isInvalid
  const message = error ?? hint

  const ring = isInvalid
    ? 'inset-ring-2 inset-ring-field-border-error'
    : isValid
      ? 'inset-ring inset-ring-success/60 focus-within:inset-ring-2 focus-within:inset-ring-field-border-focus'
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
          aria-describedby={message ? messageId : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-text shadow-none outline-none type-body"
          {...inputProps}
        />
        {suffix}
        {isInvalid && <Icon name="avviso" size={18} className="text-danger-soft" />}
        {isValid && <Icon name="conferma" size={18} className="text-success" />}
      </div>
      {message && (
        <FieldMessage id={messageId} tone={isInvalid ? 'error' : isValid ? 'success' : 'neutral'}>
          {message}
        </FieldMessage>
      )}
    </div>
  )
}
