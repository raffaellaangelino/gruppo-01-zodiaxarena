import { Link } from 'react-router'
import type { ReactNode } from 'react'
import { PATHS } from '@/app/paths'
import { TilePanel } from '@/components/panels/TilePanel'
import { BandPanel } from '@/components/panels/BandPanel'
import { Icon } from '@/components/ui/Icon'
import marteCard from '@/assets/cards/marte.webp'
import venereCard from '@/assets/cards/venere.webp'

interface BattleColumnProps {
  number: number
  title: string
  children: ReactNode
}

function BattleColumn({ number, title, children }: BattleColumnProps) {
  return (
    <section className="guide-battle-column">
      <h3>
        <span className="guide-battle-number" aria-hidden="true">
          <span>{number}</span>
        </span>
        {title}
      </h3>
      {children}
    </section>
  )
}

function StatPill({
  children,
  tone = 'blue',
}: {
  children: string
  tone?: 'blue' | 'red' | 'purple'
}) {
  return <span className={`guide-stat-pill guide-stat-pill--${tone}`}>{children}</span>
}

export function GuideBattle() {
  return (
    <>
      <TilePanel className="guide-battle-panel" aria-label="Esempio dello scontro">
        <div className="guide-battle">
          <header className="guide-battle__header">
            <h3>✦ Esempio · Marte in Ariete contro Venere in Toro</h3>
            <span>Per semplicità: niente Fazione e niente Ascendente.</span>
          </header>

          <div className="guide-battle__columns">
            <BattleColumn number={1} title="Entrano in gioco">
              <div className="guide-battle-cards">
                <figure>
                  <img src={marteCard} alt="Marte in Ariete" />
                  <figcaption>Marte in Ariete</figcaption>
                </figure>
                <figure>
                  <img src={venereCard} alt="Venere in Toro" />
                  <figcaption>Venere in Toro</figcaption>
                </figure>
              </div>
              <div className="guide-battle-values">
                <p>
                  <strong>Marte</strong>
                  <span>20 + 1 Fuoco + 1 vantaggio =</span>
                  <StatPill tone="red">+22</StatPill>
                </p>
                <p>
                  <span>11 + 2 Casa I =</span>
                  <StatPill>13</StatPill>
                </p>
                <p>
                  <strong>Venere</strong>
                  <span>8</span>
                  <StatPill tone="red">+8</StatPill>
                </p>
                <p>
                  <span>14 + 2 Casa I =</span>
                  <StatPill>16</StatPill>
                </p>
              </div>
            </BattleColumn>

            <BattleColumn number={2} title="Si colpiscono insieme">
              <p>
                Le due creature si colpiscono <strong>nello stesso istante</strong>: ognuna toglie
                il suo ATK alla DEF dell’altra.
              </p>
              <p className="guide-battle-equation">
                <strong>Venere</strong>
                <span>16 − 22 =</span>
                <StatPill>−6</StatPill>
              </p>
              <p className="guide-battle-danger">Venere cade.</p>
              <p className="guide-battle-equation">
                <strong>Marte</strong>
                <span>13 − 8 =</span>
                <StatPill>5</StatPill>
              </p>
              <p>Marte resta in gioco con 5 DEF.</p>
            </BattleColumn>

            <BattleColumn number={3} title="Danno in eccesso">
              <p>
                Quando cade una sola creatura, il suo Astromante perde i PV che il colpo aveva in
                più della DEF.
              </p>
              <p className="guide-battle-equation">
                <strong>Eccesso</strong>
                <span>22 − 16 = 6, poi −1 della Terra</span>
                <StatPill tone="purple">5</StatPill>
              </p>
              <p>Il giocatore di Venere scende da 10 a 5 PV.</p>
              <p aria-label="5 Punti Vita rimasti" className="guide-health">
                <span aria-hidden="true">✦ ✦ ✦ ✦ ✦</span>
                <span aria-hidden="true">✧ ✧ ✧ ✧ ✧</span>
              </p>
            </BattleColumn>
          </div>
        </div>
      </TilePanel>

      <ul className="guide-battle-rules">
        <li>
          La creatura che resta in gioco tiene la DEF che le rimane. Chi ha perso la sua pesca la
          prossima, e si ricomincia.
        </li>
        <li>Se cadono tutte e due nello stesso colpo, nessuno perde PV.</li>
        <li>
          Vince chi porta l’avversario a 0 PV. Se le carte finiscono prima, si guarda chi ha più PV:
          lo spiega il capitolo successivo.
        </li>
      </ul>

      <BandPanel className="guide-scroll-note" aria-label="Rotolo di Lachesi">
        <Icon name="rotolo" size={18} />
        <p>
          Nel Rotolo di Lachesi ogni numero ha la sua spiegazione: tocca un valore per vedere da
          dove viene.
        </p>
        <Link to={PATHS.challenges}>Le tue partite ›</Link>
      </BandPanel>
    </>
  )
}
