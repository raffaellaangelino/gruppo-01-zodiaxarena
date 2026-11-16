import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { AppRoutes } from '@/app/AppRoutes'
import { queryClient } from '@/app/queryClient'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { readToken } from '@/features/auth/tokenStorage'
import { setTokenProvider } from '@/lib/http'

// Ogni chiamata alle API legge il token della sessione da qui, già prima del primo disegno.
setTokenProvider(readToken)

/**
 * Radice dell'applicazione: i provider condivisi (dati del server, sessione, navigazione)
 * e le pagine.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
