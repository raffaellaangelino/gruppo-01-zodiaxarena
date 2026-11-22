import { GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { PATHS, matchVerdictPath, playChallengePath } from '@/app/paths'
import { GOD_LABELS } from '@/domain/labels'
import { daysUntil, shortDateLabel } from '@/lib/dates'
import { plural } from '@/lib/plural'
import type { DashboardSummary } from '@/features/home/dashboardTypes'
import '../dashboard.css'

export function DashboardGrid({ dashboard }: { dashboard: DashboardSummary }) {
  const god = dashboard.faction ? GOD_LABELS[dashboard.faction] : null
  const factionElements = {
    EFESTO: 'FIRE',
    POSEIDONE: 'WATER',
    DEMETRA: 'EARTH',
    ERA: 'AIR',
  } as const
  const moonDays =
    dashboard.nextFullMoon && dashboard.nextFullMoon !== '' ? daysUntil(dashboard.nextFullMoon) : null

  return (
    <div className="dashboard-grid" aria-label="Dashboard dell'area utente">
      <section className="dashboard-card dashboard-card--credits p-5" aria-labelledby="dashboard-credits">
        <p id="dashboard-credits" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Saldo crediti
        </p>
        <p className="mt-3 text-text tabular-nums type-stat">{dashboard.credits}</p>
        <GoldLink to={PATHS.shop} hero size="l" className="mt-5 w-full">
          Apri un pacchetto
        </GoldLink>
      </section>

      <section className="dashboard-card dashboard-card--faction p-5" aria-labelledby="dashboard-faction">
        <p id="dashboard-faction" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Casa scelta
        </p>
        {dashboard.faction && god ? (
          <div className="mt-4 flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-surface-2">
              <ElementEmblem
                element={factionElements[dashboard.faction]}
                size={40}
              />
            </span>
            <div className="min-w-0">
              <h2 className="text-text type-h2">{god.name}</h2>
              <p className="mt-1 text-text-muted type-body">{god.effect}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-text-muted type-body">Scegli la tua casa con Ermes.</p>
        )}
        <p className="mt-4 flex items-center gap-2 text-text-muted type-meta">
          <Icon name="luna-piena" size={18} className="text-gold-bright" />
          {moonDays === null
            ? 'Prossima luna piena non disponibile'
            : `Prossima luna piena tra ${plural(moonDays, 'giorno', 'giorni')}`}
        </p>
        <SecondaryLink
          to={PATHS.faction}
          size="m"
          aria-disabled={!dashboard.moonWindowOpen}
          className={`mt-4 w-full ${dashboard.moonWindowOpen ? '' : 'pointer-events-none opacity-55'}`}
        >
          Cambia casa
        </SecondaryLink>
        {!dashboard.moonWindowOpen && (
          <p className="mt-2 text-text-muted type-meta">
            Disponibile solo nei tre giorni dalla luna piena.
          </p>
        )}
      </section>

      <section className="dashboard-card dashboard-card--pending p-5" aria-labelledby="dashboard-pending">
        <p id="dashboard-pending" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Ti aspettano
        </p>
        <div className="mt-3 flex gap-3">
          <span className="rounded-pill bg-surface-2 px-3 py-2 text-text type-meta-strong">
            {dashboard.challenges.length} sfide
          </span>
          <span className="rounded-pill bg-surface-2 px-3 py-2 text-text type-meta-strong">
            {dashboard.trades.length} scambi
          </span>
        </div>

        {dashboard.challenges.map((challenge) => (
          <article key={`challenge-${challenge.id}`} className="mt-4 border-t border-line-soft pt-4">
            <p className="text-text type-body-strong">{challenge.nickname} ti ha sfidato</p>
            <p className="text-text-muted type-meta">{shortDateLabel(challenge.receivedAt)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <SecondaryLink to={PATHS.challenges} className="w-full">Rifiuta</SecondaryLink>
              <GoldLink to={playChallengePath(challenge.id)} className="w-full">Accetta</GoldLink>
            </div>
          </article>
        ))}

        {dashboard.trades.map((trade) => (
          <article key={`trade-${trade.id}`} className="mt-4 border-t border-line-soft pt-4">
            <p className="text-text type-body-strong">{trade.nickname} propone uno scambio</p>
            <p className="text-text-muted type-meta">
              {trade.offeredCards} carte contro {trade.requestedCards}
            </p>
            <GoldLink to={PATHS.trades} className="mt-3 w-full">Rispondi</GoldLink>
          </article>
        ))}

        {dashboard.challenges.length === 0 && dashboard.trades.length === 0 && (
          <p className="mt-4 text-text-muted type-body">Nessuna sfida o scambio in attesa.</p>
        )}
      </section>

      <section className="dashboard-card dashboard-card--missions p-5" aria-labelledby="dashboard-missions">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p id="dashboard-missions" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
              Missioni giornaliere
            </p>
            <p className="mt-1 text-text-muted type-meta">Si rinnovano al tramonto</p>
          </div>
          <Icon name="missione" size={24} className="text-gold-bright" />
        </div>
        {dashboard.missions.length > 0 ? (
          <div className="mt-4">
            {dashboard.missions.map((mission) => {
              const percent = Math.min(100, Math.round((mission.done / mission.total) * 100))
              return (
                <article key={mission.id} className="dashboard-mission py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-text type-h3-compact">{mission.title}</h3>
                      <p className="mt-1 text-text-muted type-meta">{mission.description}</p>
                    </div>
                    <span className="shrink-0 text-gold-bright tabular-nums type-meta-strong">
                      +{mission.reward}
                    </span>
                  </div>
                  <div
                    className="dashboard-progress mt-3"
                    role="progressbar"
                    aria-label={mission.title}
                    aria-valuemin={0}
                    aria-valuemax={mission.total}
                    aria-valuenow={mission.done}
                  >
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-2 text-right text-text-muted tabular-nums type-meta">
                    {mission.done} / {mission.total}
                  </p>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="mt-4 text-text-muted type-body">Nessuna missione disponibile oggi.</p>
        )}
      </section>

      <section className="dashboard-card dashboard-card--match p-5" aria-labelledby="dashboard-match">
        <p id="dashboard-match" className="type-eyebrow tracking-[0.12em] text-gold uppercase">
          Ultima partita
        </p>
        {dashboard.lastMatch ? (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-text-muted type-meta">Contro {dashboard.lastMatch.opponent}</p>
                <h2
                  className={`mt-1 type-h2 ${
                    dashboard.lastMatch.outcome === 'WIN' ? 'text-success' : 'text-danger'
                  }`}
                >
                  {dashboard.lastMatch.outcome === 'WIN' ? 'Vittoria' : 'Sconfitta'}
                </h2>
              </div>
              <Icon
                name={dashboard.lastMatch.outcome === 'WIN' ? 'vittoria' : 'sconfitta'}
                size={32}
                className={dashboard.lastMatch.outcome === 'WIN' ? 'text-success' : 'text-danger'}
              />
            </div>
            <p className="mt-3 text-text-muted type-meta">
              {dashboard.lastMatch.rounds} round · {shortDateLabel(dashboard.lastMatch.playedAt)}
            </p>
            <GoldLink
              to={matchVerdictPath(dashboard.lastMatch.id)}
              className="mt-4 w-full"
            >
              Apri il Rotolo di Lachesi
            </GoldLink>
          </div>
        ) : (
          <p className="mt-4 text-text-muted type-body">Non hai ancora giocato una partita.</p>
        )}
      </section>

      <section className="dashboard-card dashboard-card--quick p-5" aria-labelledby="dashboard-shortcuts">
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
