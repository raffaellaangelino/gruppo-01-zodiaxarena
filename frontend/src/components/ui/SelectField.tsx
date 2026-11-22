import { useId, type ComponentPropsWithoutRef } from 'react'
import { Icon } from '@/components/ui/Icon'

/** Una scelta del selettore. */
export interface SelectOption {
  value: string
  label: string
}

/** Proprietà di {@link SelectField}. */
export interface SelectFieldProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  /** Nome del campo; sempre presente per gli screen reader, anche se nascosto. */
  label: string
  /** Nasconde l'etichetta quando il nome è già scritto sopra un gruppo (es. "Data di nascita"). */
  hideLabel?: boolean
  /** Testo mostrato finché non si sceglie (es. "Giorno"). */
  placeholder: string
  options: SelectOption[]
  /** Campo non valido: bordo rosso. Il messaggio lo scrive il gruppo sotto i campi. */
  invalid?: boolean
  /**
   * `field` (base): campo dei moduli, etichetta sopra, alto 44. `filter`: filtro di una lista
   * (tavola Collezione-Cielo, "Ordina: ATK"): pillola alta 36 con il nome dentro e la scelta in oro.
   */
  variant?: 'field' | 'filter'
}

/**
 * Selettore del design system: lo stesso campo a filo di {@link TextField} (raggio 8, altezza 44)
 * con la freccia "espandi" a destra. È un `<select>` nativo: su telefono apre la ruota del sistema,
 * che per giorno, mese e anno è la scelta più rapida.
 */
export function SelectField({
  label,
  hideLabel = false,
  placeholder,
  options,
  invalid = false,
  variant = 'field',
  id,
  className = '',
  value,
  ...selectProps
}: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const ring = invalid
    ? 'inset-ring-2 inset-ring-field-border-error'
    : 'inset-ring inset-ring-field-border focus-within:inset-ring-2 focus-within:inset-ring-field-border-focus'

  if (variant === 'filter') {
    return (
      <div
        className={`relative flex h-9 items-center gap-1 rounded-pill pr-9 pl-4 inset-ring inset-ring-field-border focus-within:inset-ring-2 focus-within:inset-ring-field-border-focus ${className}`}
      >
        <label htmlFor={selectId} className="shrink-0 text-text type-meta-strong">
          {label}:
        </label>
        <select
          id={selectId}
          value={value}
          className="field-sizing-content h-full min-w-0 cursor-pointer appearance-none bg-transparent text-gold-bright shadow-none outline-none type-meta-strong"
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-text">
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="espandi"
          size={14}
          className="pointer-events-none absolute right-3.5 text-text-muted"
        />
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label
        htmlFor={selectId}
        className={hideLabel ? 'sr-only' : 'text-text-soft type-meta-strong'}
      >
        {label}
      </label>
      <div className={`relative flex h-11 items-center rounded-control bg-field-bg ${ring}`}>
        <select
          id={selectId}
          value={value}
          aria-invalid={invalid || undefined}
          className={`h-full w-full cursor-pointer appearance-none bg-transparent pr-10 pl-4 shadow-none outline-none type-body ${value === '' ? 'text-text-muted' : 'text-text'}`}
          {...selectProps}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-text">
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="espandi"
          size={16}
          className="pointer-events-none absolute right-4 text-text-muted"
        />
      </div>
    </div>
  )
}
