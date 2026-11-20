import { BrowserRouter } from 'react-router'
import { AppRoutes } from '@/app/AppRoutes'
import { AuthProvider } from '@/features/auth/AuthProvider'

/**
 * Radice dell'applicazione: i provider condivisi (sessione, navigazione) e le pagine.
 */
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
