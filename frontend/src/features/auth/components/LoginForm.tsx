import { FormAlert } from '@/components/ui/FormAlert'
import { GoldButton } from '@/components/ui/GoldButton'
import { PasswordField } from '@/components/ui/PasswordField'
import { TextField } from '@/components/ui/TextField'
import { useLoginForm } from '@/features/auth/hooks/useLoginForm'
import { LOGIN_FAILURE_MESSAGES } from '@/features/auth/messages'

/**
 * Modulo d'accesso (tavole Accedi e Accedi-Errore): errore generico sopra i campi,
 * email, password con "Mostra", pulsante eroico subito sotto i campi.
 * La logica è in {@link useLoginForm}; qui c'è solo la grafica.
 */
export function LoginForm() {
  const { fieldProps, handleSubmit, isValid, submitting, failure, passwordRef } = useLoginForm()

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      {failure && <FormAlert>{LOGIN_FAILURE_MESSAGES[failure]}</FormAlert>}

      <TextField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        {...fieldProps('email')}
      />
      <PasswordField
        label="Password"
        autoComplete="current-password"
        required
        inputRef={passwordRef}
        {...fieldProps('password')}
      />

      <GoldButton
        hero
        size="l"
        type="submit"
        disabled={!isValid}
        busy={submitting}
        className="mt-2 w-full"
      >
        {submitting ? 'Accesso…' : 'Accedi'}
      </GoldButton>
    </form>
  )
}
