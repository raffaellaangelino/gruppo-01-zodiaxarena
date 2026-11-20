import { Icon } from '@/components/ui/Icon'

/**
 * Etichetta "Dati di esempio": compare finché alcune parti usano dati finti perché il backend
 * non ha ancora le loro API. Così nessuno scambia i numeri per veri (nemmeno in una demo).
 * Sta in basso a sinistra, sopra la barra mobile: non copre i titoli delle pagine.
 */
export function MockDataNotice() {
  return (
    <aside
      aria-label="Avviso"
      className="fixed bottom-[calc(var(--shell-bottom)+var(--za-space-3))] left-3 z-50 flex items-center gap-2 rounded-pill bg-surface-2 px-3 py-1 text-warning shadow-panel type-caption"
    >
      <Icon name="info" size={14} />
      Dati di esempio
    </aside>
  )
}
