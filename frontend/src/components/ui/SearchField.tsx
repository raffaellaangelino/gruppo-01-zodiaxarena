import type { ComponentPropsWithoutRef } from 'react'
import { Icon } from '@/components/ui/Icon'

/** Proprietà di {@link SearchField}. */
export interface SearchFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size'> {
  /** Nome del campo per gli screen reader (il segnaposto non basta). */
  label: string
}

/**
 * Campo di ricerca a pillola (tavole Sfide, Sfide-Nuova): lente a sinistra, bordo chiaro,
 * bordo d'oro quando è attivo. Per cercare giocatori, carte, scambi.
 *
 * @example <SearchField label="Cerca un giocatore" placeholder="Cerca un giocatore per nome" />
 */
export function SearchField({ label, className = '', ...inputProps }: SearchFieldProps) {
  return (
    <label
      className={`flex h-11 items-center gap-2 rounded-pill bg-field-bg px-4 text-text-muted inset-ring inset-ring-text/20 focus-within:inset-ring-2 focus-within:inset-ring-field-border-focus ${className}`}
    >
      <Icon name="cerca" size={18} className="shrink-0" />
      <span className="sr-only">{label}</span>
      <input
        type="search"
        autoComplete="off"
        spellCheck={false}
        className="h-full min-w-0 flex-1 bg-transparent text-text shadow-none outline-none type-body placeholder:text-text-muted/70"
        {...inputProps}
      />
    </label>
  )
}
