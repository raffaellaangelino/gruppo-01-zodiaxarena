import { GoldButton } from '@/components/ui/GoldButton'
import { useAuth } from '@/features/auth/useAuth'

/**
 * Home provvisoria, riservata a chi ha effettuato l'accesso.
 * Serve solo a provare il flusso di accesso e uscita: la Home vera (D-021, scenica)
 * arriva con la sua issue.
 */
export function HomePage() {
  const { logout } = useAuth()
  return (
    <main className="grid min-h-dvh place-content-center gap-6 p-4 text-center">
      <title>Home · Zodiax Arena</title>
      <h1 className="text-gold-bright type-h1">Sei dentro</h1>
      <p className="text-text-muted">Home provvisoria: la vera Home arriva con la sua issue.</p>
      <GoldButton onClick={logout}>Esci</GoldButton>
    </main>
  )
}
