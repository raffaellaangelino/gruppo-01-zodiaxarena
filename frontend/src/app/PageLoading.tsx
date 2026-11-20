import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { LoadingConstellation } from '@/components/progress/LoadingConstellation'

/**
 * Attesa dentro il guscio, per una pagina i cui dati non sono stati caricati all'ingresso:
 * le barre restano, al centro la costellazione che si accende.
 */
export function PageLoading() {
  return (
    <output className="grid min-h-dvh place-content-center justify-items-center gap-4 pt-(--shell-top) pb-(--shell-bottom)">
      <PorticoBackdrop />
      <LoadingConstellation />
      <span className="text-text-soft type-meta">Caricamento…</span>
    </output>
  )
}
