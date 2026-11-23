import marte from '@/assets/cards/marte.webp'
import { PATHS } from '@/app/paths'
import { TilePanel } from '@/components/panels/TilePanel'
import { Coin } from '@/components/ui/Coin'
import { Icon } from '@/components/ui/Icon'
import { LineTitle } from '@/components/ui/LineTitle'
import { GoldLink } from '@/components/ui/GoldButton'

/** Missione a tempo e riepilogo delle ricompense speciali. */
export function SpecialMissionPanel() {
  return (
    <div className="missions-aside">
      <TilePanel className="special-mission">
        <div className="special-mission__content">
          <LineTitle as="h2" textClassName="special-mission__title">
            Missione speciale
          </LineTitle>
          <div className="special-mission__timer">
            <Icon name="scadenza" size={14} />
            Disponibile ancora per 23 ore
          </div>
          <div className="special-mission__challenge">
            <img src={marte} alt="" className="special-mission__art" />
            <div>
              <p className="special-mission__eyebrow">La prova dell&apos;Arena</p>
              <h3>Dimostra il tuo valore</h3>
              <p className="special-mission__description">
                Completa una sfida contro un altro Custode.
              </p>
            </div>
          </div>
          <div className="special-mission__reward">
            <span className="special-mission__reward-label">Ricompensa</span>
            <span className="special-mission__reward-item">
              <Coin size={19} />
              100 crediti
            </span>
            <span className="special-mission__reward-item">
              <Icon name="carta" size={18} />
              Carta speciale
            </span>
          </div>
          <GoldLink to={PATHS.challenges} size="m" className="special-mission__action">
            Accetta la missione
          </GoldLink>
        </div>
      </TilePanel>

      <TilePanel className="mission-note">
        <div className="mission-note__content">
          <Icon name="ricompensa" size={24} />
          <div>
            <h2>Ogni impresa ha il suo premio</h2>
            <p>Completa gli obiettivi per ottenere crediti e nuove ricompense.</p>
          </div>
        </div>
      </TilePanel>
    </div>
  )
}
