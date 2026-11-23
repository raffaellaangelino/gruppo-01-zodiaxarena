import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import marte from '@/assets/cards/marte.webp'
import saturno from '@/assets/cards/saturno.webp'
import sole from '@/assets/cards/sole.webp'
import venere from '@/assets/cards/venere.webp'
import keyartHome from '@/assets/images/keyart-home.webp'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { CardFan } from '@/components/game/CardFan'
import { Medallion } from '@/components/ui/Medallion'
import { Icon } from '@/components/ui/Icon'
import { GoldLink } from '@/components/ui/GoldButton'
import { TertiaryLink } from '@/components/ui/TertiaryButton'
import { GOD_LABELS, SIGN_LABELS } from '@/domain/labels'
import { ProfilePanel } from '@/features/player/components/ProfilePanel'
import { ProfileShowcase } from '@/features/player/components/ProfileShowcase'
import type { PlayerSummary } from '@/features/player/types'
import type { CardThumb } from '@/domain/game'
import './profile.css'

const PUBLIC_PROFILE: Pick<PlayerSummary, 'nickname' | 'sign' | 'faction'> = {
  nickname: 'Orione',
  sign: 'BILANCIA',
  faction: { god: 'DEMETRA', element: 'EARTH' },
}

const SKY_CARDS: CardThumb[] = [
  { id: 1, code: 'VENERE-TORO-I', imageUrl: venere },
  { id: 2, code: 'SOLE-LEONE-I', imageUrl: sole },
  { id: 3, code: 'SATURNO-CAPRICORNO-I', imageUrl: saturno },
  { id: 4, code: 'MARTE-ARIETE-I', imageUrl: marte },
]

const PROFILE_STATS = [
  { value: '27', label: 'partite' },
  { value: '15', label: 'vittorie', accent: true },
  { value: '11', label: 'sconfitte' },
  { value: '1', label: 'pareggio' },
  { value: '56%', label: 'win rate' },
]

export function ProfilePage() {
  const player = PUBLIC_PROFILE
  const faction = player.faction

  return (
    <main className="profile-page">
      <title>Profilo pubblico di Orione · Zodiax Arena</title>
      <PorticoBackdrop />

      <div className="profile-page__inner">
        <header className="profile-page__top">
          <section className="profile-identity" aria-label="Profilo pubblico di Orione">
            <Medallion size={96} className="profile-identity__medallion">
              <svg
                aria-hidden="true"
                className="profile-sign-mark"
                viewBox="0 0 64 64"
              >
                <circle cx="32" cy="32" r="22" />
                <circle cx="32" cy="32" r="17" />
                <path d="M20 27h24M24 39h16M32 27v12M23 27c2-7 6-10 9-10s7 3 9 10" />
                <circle cx="32" cy="45" r="1.5" />
              </svg>
            </Medallion>
            <div className="profile-identity__copy">
              <p className="profile-eyebrow">Profilo pubblico</p>
              <h1>{player.nickname}</h1>
              <p className="profile-identity__meta">
                Sole in {SIGN_LABELS[player.sign]} <span aria-hidden="true">·</span>
                {faction && (
                  <>
                    <span className="profile-faction-mark" aria-hidden="true">✦</span>
                    Fazione {GOD_LABELS[faction.god].name}
                  </>
                )}
                <span aria-hidden="true">·</span> Membro dal 21 agosto 2025
              </p>
            </div>
          </section>

          <nav className="profile-actions" aria-label="Azioni sul profilo">
            <TertiaryLink to={PATHS.newChallenge} icon="sfide" size="s">
              Invita alla sfida
            </TertiaryLink>
            <TertiaryLink to={PATHS.trades} icon="scambi" size="s">
              Proponi uno scambio
            </TertiaryLink>
            <GoldLink to={PATHS.faction} size="m">
              Gilda
            </GoldLink>
          </nav>
        </header>

        <div className="profile-page__columns">
          <div className="profile-main-column">
            <dl className="profile-stats" aria-label="Statistiche del profilo">
              {PROFILE_STATS.map((stat) => (
                <div className="profile-stat" key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd className={stat.accent ? 'profile-stat__value--accent' : ''}>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>

            <section className="profile-sky" aria-labelledby="profile-sky-title">
              <div className="profile-sky__overview">
                <CardFan cards={SKY_CARDS} cardWidth={24} step={9} tilt={2} />
                <div className="profile-sky__copy">
                  <h2 id="profile-sky-title">Il Cielo di {player.nickname}</h2>
                  <p>
                    Sole in {SIGN_LABELS[player.sign]} · 7 pianeti · Ascendente in Sagittario
                  </p>
                </div>
                <Link to={PATHS.deck} className="profile-text-link">
                  Apri il Cielo <Icon name="avanti" size={14} />
                </Link>
              </div>
              <div className="profile-sky__bar">
                <span style={{ width: '72%' }} />
              </div>
            </section>

            <ProfileShowcase />
          </div>

          <aside className="profile-side-column" aria-label="Pacchetti">
            <ProfilePanel title="Pacchetti" className="profile-packs">
              <Link to={PATHS.shop} className="profile-pack-art" aria-label="Vai al Negozio">
                <img src={keyartHome} alt="" />
                <span className="profile-pack-art__shade" />
                <Medallion size={34} variant="avatar" className="profile-pack-art__medallion">
                  <Icon name="pacchetto" size={20} className="text-gold-bright" />
                </Medallion>
                <strong>Pacchetto della Bilancia</strong>
              </Link>
              <p className="profile-pack-description">
                Scopri le nuove carte e completa il tuo Cielo.
              </p>
            </ProfilePanel>
          </aside>
        </div>
      </div>
    </main>
  )
}
