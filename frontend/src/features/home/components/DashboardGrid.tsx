import { GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { CardFan } from '@/components/game/CardFan'
import { DeckValidity } from '@/components/game/DeckValidity'
import { PATHS, matchVerdictPath, playChallengePath } from '@/app/paths'
import { GOD_LABELS } from '@/domain/labels'
import { daysUntil, shortDateLabel } from '@/lib/dates'
import { plural } from '@/lib/plural'
import type { HomeSummary, WaitingItem } from '@/features/home/types'
import type { PlayerSummary } from '@/features/player/types'
import '../dashboard.css'

export function DashboardGrid({ home, player }: { home: HomeSummary; player: PlayerSummary }) {
  const faction = player.faction
  const god = faction ? GOD_LABELS[faction.god] : null
  const moonDays = home.fullMoon ? daysUntil(home.fullMoon.nextAt) : null
  const challengeCount = home.waiting.filter((item) => item.kind === 'CHALLENGE_RECEIVED').length
  const replayCount = home.waiting.filter((item) => item.kind === 'REPLAY_UNSEEN').length
  const tradeCount = home.waiting.filter((item) => item.kind === 'TRADE_RECEIVED').length
  const missionPercent =
    home.missions && home.missions.total > 0
      ? Math.min(100, Math.round((home.missions.done / home.missions.total) * 100))
      : 0

  return (
    <div className="dashboard-grid" aria-label="Dashboard dell'area utente">
      <section
        className="dashboard-card dashboard-card--credits p-5"
        aria-labelledby="dashboard-credits"
      >
        <p id="dashboard-credits" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Saldo crediti
        </p>
        <p className="mt-3 text-text tabular-nums type-stat">
          {player.credits.toLocaleString('it-IT')}
        </p>
        <GoldLink to={PATHS.shop} hero size="l" className="mt-5 w-full">
          Apri un pacchetto
        </GoldLink>
      </section>

      <section
        className="dashboard-card dashboard-card--faction p-5"
        aria-labelledby="dashboard-faction"
      >
        <p id="dashboard-faction" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          La tua Fazione
        </p>
        {faction && god ? (
          <div className="mt-4 flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-surface-2">
              <ElementEmblem element={faction.element} size={40} />
            </span>
            <div className="min-w-0">
              <h2 className="type-h2 text-text">{god.name}</h2>
              <p className="mt-1 text-text-muted type-body">{god.effect}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-text-muted type-body">Scegli la tua Fazione con Ermes.</p>
        )}
        {moonDays !== null && (
          <p className="mt-4 flex items-center gap-2 text-text-muted type-meta">
            <Icon name="luna-piena" size={18} className="text-gold-bright" />
            {home.fullMoon?.windowOpen
              ? 'Finestra di cambio Fazione aperta'
              : `Prossima luna piena tra ${plural(moonDays, 'giorno', 'giorni')}`}
          </p>
        )}
        <SecondaryLink to={PATHS.faction} size="m" className="mt-4 w-full">
          {faction ? 'Dettagli Fazione' : 'Scegli Fazione'}
        </SecondaryLink>
      </section>

      <section
        className="dashboard-card dashboard-card--pending p-5"
        aria-labelledby="dashboard-pending"
      >
        <p id="dashboard-pending" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Ti aspettano
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-pill bg-surface-2 px-3 py-2 text-text type-meta-strong">
            {plural(challengeCount, 'sfida', 'sfide')}
          </span>
          <span className="rounded-pill bg-surface-2 px-3 py-2 text-text type-meta-strong">
            {plural(replayCount, 'partita', 'partite')} da rivedere
          </span>
          {tradeCount > 0 && (
            <span className="rounded-pill bg-surface-2 px-3 py-2 text-text type-meta-strong">
              {plural(tradeCount, 'scambio', 'scambi')}
            </span>
          )}
        </div>
        {home.waiting.map((item) => (
          <WaitingCard key={`${item.kind}-${item.id}`} item={item} />
        ))}
        {home.waiting.length === 0 && (
          <p className="mt-4 text-text-muted type-body">Nessuna attività in attesa.</p>
        )}
      </section>

      <section
        className="dashboard-card dashboard-card--missions p-5"
        aria-labelledby="dashboard-missions"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p
              id="dashboard-missions"
              className="type-eyebrow tracking-[0.12em] text-gold uppercase"
            >
              Missioni giornaliere
            </p>
            <p className="mt-1 text-text-muted type-meta">Si rinnovano al tramonto</p>
          </div>
          <Icon name="missione" size={24} className="text-gold-bright" />
        </div>
        {home.missions ? (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-4 text-text type-body">
              <span>Completamento</span>
              <span className="tabular-nums">
                {home.missions.done} / {home.missions.total}
              </span>
            </div>
            <div aria-hidden="true" className="dashboard-progress mt-3">
              <span style={{ width: `${missionPercent}%` }} />
            </div>
          </div>
        ) : (
          <p className="mt-4 text-text-muted type-body">
            Dati delle missioni non ancora disponibili.
          </p>
        )}
      </section>

      <section className="dashboard-card dashboard-card--deck p-5" aria-labelledby="dashboard-deck">
        <p id="dashboard-deck" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Il tuo Cielo
        </p>
        {home.deck ? (
          <div className="mt-4">
            <h2 className="type-h2 text-text">{home.deck.name}</h2>
            <div className="mt-2">
              <DeckValidity valid={home.deck.valid} />
            </div>
            <CardFan cards={home.deck.cards} cardWidth={48} step={12} />
          </div>
        ) : (
          <p className="mt-4 text-text-muted type-body">Non hai ancora creato un Cielo.</p>
        )}
        <GoldLink to={PATHS.deck} className="mt-4 w-full">
          {home.deck ? 'Apri i miei Cieli' : 'Crea il tuo Cielo'}
        </GoldLink>
      </section>

      <section
        className="dashboard-card dashboard-card--quick p-5"
        aria-labelledby="dashboard-shortcuts"
      >
        <p id="dashboard-shortcuts" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Accessi rapidi
        </p>
        <div className="mt-4 grid gap-3">
          <GoldLink to={PATHS.deck} className="w-full">
            I miei mazzi
          </GoldLink>
          <SecondaryLink to={PATHS.newChallenge} className="w-full">
            Sfida un amico
          </SecondaryLink>
        </div>
      </section>
    </div>
  )
}

function WaitingCard({ item }: { item: WaitingItem }) {
  let title: string
  let detail: string
  let to: string
  let action: string

  switch (item.kind) {
    case 'CHALLENGE_RECEIVED':
      title = `${item.from.nickname} ti ha sfidato`
      detail = shortDateLabel(item.receivedAt)
      to = playChallengePath(item.id)
      action = 'Apri la sfida'
      break
    case 'REPLAY_UNSEEN':
      title = `Partita contro ${item.opponent.nickname}`
      detail = 'Hai un Rotolo da rivedere'
      to = matchVerdictPath(item.id)
      action = 'Rivedi la partita'
      break
    case 'TRADE_RECEIVED':
      title = `${item.from.nickname} propone uno scambio`
      detail = `${item.cardsOffered} carte contro ${item.cardsRequested} · scade ${shortDateLabel(item.expiresAt)}`
      to = PATHS.trades
      action = 'Apri gli scambi'
      break
  }

  return (
    <article className="mt-4 border-t border-line-soft pt-4">
      <p className="text-text type-body-strong">{title}</p>
      <p className="text-text-muted type-meta">{detail}</p>
      <GoldLink to={to} className="mt-3 w-full">
        {action}
      </GoldLink>
    </article>
  )
}
