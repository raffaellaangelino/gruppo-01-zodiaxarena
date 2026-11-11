import { TertiaryButton } from '@/components/ui/TertiaryButton'
import { useAuth } from '@/features/auth/useAuth'

/** "Esci": chiude la sessione su questo dispositivo e riporta all'accesso. */
export function LogoutButton() {
  const { logout } = useAuth()
  return (
    <TertiaryButton icon="esci" onClick={logout}>
      Esci
    </TertiaryButton>
  )
}
