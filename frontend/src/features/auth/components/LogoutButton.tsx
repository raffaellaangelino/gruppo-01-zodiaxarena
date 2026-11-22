import { TertiaryButton } from '@/components/ui/TertiaryButton'
import { useNavigate } from 'react-router'
import { PATHS } from '@/app/paths'
import { useAuth } from '@/features/auth/useAuth'

/** "Esci": chiude la sessione su questo dispositivo e riporta all'accesso. */
export function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate(PATHS.home, { replace: true })
  }
  return (
    <TertiaryButton icon="esci" onClick={handleLogout}>
      Esci
    </TertiaryButton>
  )
}
