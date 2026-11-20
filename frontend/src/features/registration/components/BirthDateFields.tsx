import { useId } from 'react'
import { FieldMessage } from '@/components/ui/FieldMessage'
import { SelectField, type SelectOption } from '@/components/ui/SelectField'
import { BIRTH_DATE_MESSAGES, MONTHS } from '@/features/registration/messages'
import type { BirthDateValues } from '@/features/registration/types'
import { daysInMonth } from '@/features/registration/validation'

/** Quanti anni indietro si può scegliere. */
const YEARS_BACK = 100

/** Anni tra cui scegliere, dal più recente: calcolati una volta all'apertura dell'app. */
const YEARS: SelectOption[] = Array.from({ length: YEARS_BACK + 1 }, (_, i) => {
  const year = String(new Date().getFullYear() - i)
  return { value: year, label: year }
})

/** Mesi tra cui scegliere. */
const MONTH_OPTIONS: SelectOption[] = MONTHS.map((name, i) => ({
  value: String(i + 1),
  label: name,
}))

/** Proprietà di {@link BirthDateFields}. */
export interface BirthDateFieldsProps {
  value: BirthDateValues
  onChange: (part: keyof BirthDateValues, value: string) => void
  /** Messaggio d'errore sotto i campi; senza, c'è l'indicazione sulla privacy. */
  error?: string
}

/**
 * Data di nascita come tre selettori, giorno · mese · anno (tavola Registrati-Segno): niente
 * formato da indovinare, e su telefono si sceglie con la ruota del sistema. I giorni seguono
 * il mese scelto; se il giorno non esiste più (31 aprile), torna da scegliere.
 */
export function BirthDateFields({ value, onChange, error }: BirthDateFieldsProps) {
  const groupId = useId()
  const messageId = `${groupId}-messaggio`

  const month = Number(value.month) || undefined
  const year = Number(value.year) || undefined
  const maxDay = month ? daysInMonth(month, year) : 31
  const days: SelectOption[] = Array.from({ length: maxDay }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }))

  /** Cambia mese o anno, e lascia da scegliere un giorno che in quel mese non c'è. */
  const changeMonthOrYear = (part: 'month' | 'year', next: string) => {
    onChange(part, next)
    const nextMonth = Number(part === 'month' ? next : value.month)
    const nextYear = Number(part === 'year' ? next : value.year) || undefined
    if (nextMonth && Number(value.day) > daysInMonth(nextMonth, nextYear)) onChange('day', '')
  }

  return (
    <fieldset aria-describedby={messageId} className="flex flex-col gap-2">
      <legend className="mb-2 text-text-soft type-meta-strong">Data di nascita</legend>
      <div className="grid grid-cols-[6rem_minmax(0,1fr)_7rem] gap-3">
        <SelectField
          label="Giorno"
          hideLabel
          placeholder="Giorno"
          options={days}
          value={value.day}
          invalid={!!error}
          autoComplete="bday-day"
          onChange={(event) => onChange('day', event.target.value)}
        />
        <SelectField
          label="Mese"
          hideLabel
          placeholder="Mese"
          options={MONTH_OPTIONS}
          value={value.month}
          invalid={!!error}
          autoComplete="bday-month"
          onChange={(event) => changeMonthOrYear('month', event.target.value)}
        />
        <SelectField
          label="Anno"
          hideLabel
          placeholder="Anno"
          options={YEARS}
          value={value.year}
          invalid={!!error}
          autoComplete="bday-year"
          onChange={(event) => changeMonthOrYear('year', event.target.value)}
        />
      </div>
      <FieldMessage id={messageId} tone={error ? 'error' : 'neutral'}>
        {error ?? BIRTH_DATE_MESSAGES.hint}
      </FieldMessage>
    </fieldset>
  )
}
