import { PATHS } from '@/app/paths'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { AuthSwitchLink } from '@/features/auth/components/AuthSwitchLink'
import { LoginForm } from '@/features/auth/components/LoginForm'

/**
 * Pagina d'accesso (S02, tavole Accedi e Accedi-Errore).
 *
 * Rispetto alla tavola manca, per ora, "Password dimenticata?": il backend non ha il recupero
 * della password. Torna quando la sua pagina esiste, per non avere collegamenti a vuoto.
 */
export function LoginPage() {
  return (
    <AuthLayout>
      <title>Accedi · Zodiax Arena</title>
      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-2">
          <h1 className="text-text type-h1-m md:type-h1">Bentornato</h1>
          <p className="text-text-soft type-body">Il tuo cielo ti aspetta.</p>
        </header>
        <LoginForm />
        <AuthSwitchLink question="Non hai un account?" label="Registrati" to={PATHS.register} />
      </div>
    </AuthLayout>
  )
}
