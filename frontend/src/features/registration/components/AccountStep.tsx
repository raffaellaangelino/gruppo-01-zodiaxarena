import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { GoldButton } from '@/components/ui/GoldButton'
import { PasswordField } from '@/components/ui/PasswordField'
import { TextField } from '@/components/ui/TextField'
import type { AccountFieldProps } from '@/features/registration/hooks/useRegistrationForm'

/** Proprietà di {@link AccountStep}. */
export interface AccountStepProps {
  field: (name: AccountFieldProps['name']) => AccountFieldProps
  /** Il backend ha detto che l'email ha già un account: accanto all'errore, "Accedi". */
  emailTaken: boolean
  ready: boolean
}

/**
 * Passo 1 · Account (tavole Registrati e Registrati-Errori): nickname, email e password,
 * ognuno con il suo messaggio sotto il campo, e "Continua" largo quanto la colonna.
 */
export function AccountStep({ field, emailTaken, ready }: AccountStepProps) {
  const email = field('email')
  return (
    <>
      <div className="flex flex-col gap-4">
        <TextField
          label="Nickname"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={32}
          required
          {...field('nickname')}
        />
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          {...email}
          error={
            email.error &&
            (emailTaken ? (
              <>
                {email.error}{' '}
                <Link to={PATHS.login} className="font-extrabold text-gold-bright no-underline">
                  Accedi
                </Link>
              </>
            ) : (
              email.error
            ))
          }
        />
        <PasswordField
          label="Password"
          autoComplete="new-password"
          required
          {...field('password')}
        />
      </div>
      <GoldButton type="submit" disabled={!ready} className="mt-2 w-full">
        Continua
      </GoldButton>
    </>
  )
}
