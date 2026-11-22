import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'

/**
 * Avviso del testo segnaposto (tavola Privacy, gen_gd.privacy): una Riga con il segno di stato,
 * l'icona info ambra e una frase. Dichiara che il testo legale lo scrive il team.
 */
export function LegalNoticePanel() {
  return (
    <TilePanel as="div" variant="row" mark aria-label="Testo segnaposto" className="mt-4">
      <div className="flex items-center gap-3 py-3 pr-5 pl-6.5">
        <Icon name="info" size={20} className="shrink-0 text-warning" />
        <p className="text-text-soft type-meta">
          <b className="text-warning">Testo segnaposto.</b> L'informativa la scrive il team con il
          consulente legale: qui c'è solo il modello della pagina.
        </p>
      </div>
    </TilePanel>
  )
}
