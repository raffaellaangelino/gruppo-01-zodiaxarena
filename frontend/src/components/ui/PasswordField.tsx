import { useState } from 'react'
import { TextField, type TextFieldProps } from '@/components/ui/TextField'

/** Proprietà di {@link PasswordField}: quelle di {@link TextField}, tranne `type` e `suffix`. */
export type PasswordFieldProps = Omit<TextFieldProps, 'type' | 'suffix'>

/**
 * Campo password con "Mostra" / "Nascondi" dentro il campo, a destra.
 * Il pulsante è testuale (scelta del progetto: nel set non c'è un'icona "occhio").
 *
 * @example <PasswordField label="Password" autoComplete="current-password" />
 */
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  const toggle = (
    <button
      type="button"
      onClick={() => setVisible((v) => !v)}
      aria-label={visible ? 'Nascondi la password' : 'Mostra la password'}
      className="flex h-full shrink-0 items-center text-gold-bright type-meta-strong"
    >
      {visible ? 'Nascondi' : 'Mostra'}
    </button>
  )

  return <TextField {...props} type={visible ? 'text' : 'password'} suffix={toggle} />
}
