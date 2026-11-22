import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { PageErrorBoundary } from '@/app/PageErrorBoundary'
import { PageLoading } from '@/app/PageLoading'

/**
 * Cornice delle schermate nell'arena (attesa, Rotolo, Verdetto): a schermo intero, senza barre,
 * ma con le stesse protezioni del guscio: l'attesa mentre arrivano i dati della partita e un
 * errore leggibile, con "Riprova", se la pagina non si carica.
 */
export function ArenaLayout() {
  return (
    <PageErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <Outlet />
      </Suspense>
    </PageErrorBoundary>
  )
}
