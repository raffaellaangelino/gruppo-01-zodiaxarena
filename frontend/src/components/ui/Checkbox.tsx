import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link Checkbox}. */
export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> {
  /** Testo accanto alla casella; può contenere collegamenti. */
  children: ReactNode
}

/**
 * Casella di conferma (tavola Registrati-Conferma): quadrato 20 px, d'oro con la spunta
 * quando è scelta, contorno chiaro quando non lo è. L'`<input>` vero resta nella pagina,
 * invisibile sopra il quadrato: tastiera, focus e screen reader funzionano come al solito.
 */
export function Checkbox({ children, id, className = '', ...inputProps }: CheckboxProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <span className="relative mt-px flex size-5 shrink-0">
        <input
          id={inputId}
          type="checkbox"
          className="peer absolute inset-0 cursor-pointer appearance-none rounded-thumb inset-ring-[1.5px] inset-ring-text/40 checked:bg-(image:--za-btn-gold) checked:inset-ring-0"
          {...inputProps}
        />
        <Icon
          name="conferma"
          size={14}
          className="pointer-events-none relative m-auto hidden text-btn-ink peer-checked:block"
        />
      </span>
      <label htmlFor={inputId} className="cursor-pointer text-text-soft type-meta">
        {children}
      </label>
    </div>
  )
}
