import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/http'

/**
 * Cache dei dati del server per tutta l'applicazione.
 * - I dati restano "freschi" 30 secondi: cambiando pagina non si riscaricano subito.
 * - Un errore 4xx non si ripete (non cambierebbe nulla); rete e 5xx si riprovano una volta.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false
        return failureCount < 1
      },
    },
  },
})
