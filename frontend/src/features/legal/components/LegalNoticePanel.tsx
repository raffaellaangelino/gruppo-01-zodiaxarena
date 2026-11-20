import { Icon } from '@/components/ui/Icon'
import { TilePanel } from '@/components/panels/TilePanel'

export function LegalNoticePanel() {
  return (
    <TilePanel className="legal-notice" aria-label="Testo segnaposto">
      <Icon className="legal-notice__icon" name="info" size={18} />
      <p className="legal-notice__text">
        <strong>Testo segnaposto.</strong> L'informativa la scrive il team con il consulente legale:
        qui c'è solo il modello della pagina.
      </p>
    </TilePanel>
  )
}
