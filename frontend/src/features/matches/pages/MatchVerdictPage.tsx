import type { CSSProperties } from 'react'
import { useParams } from 'react-router'
import { MockDataNotice } from '@/app/shell/MockDataNotice'
import { PATHS, matchPath, newChallengePath } from '@/app/paths'
import { ArenaBackdrop } from '@/components/arena/ArenaBackdrop'
import { ArenaPlayer } from '@/components/arena/ArenaPlayer'
import { ArenaTopBar } from '@/components/arena/ArenaTopBar'
import { GoldLink } from '@/components/ui/GoldButton'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import { endSummary, keyMoments } from '@/features/matches/chronicle'
import { MatchCardImage } from '@/features/matches/components/MatchCardImage'
import { MATCH_COPY } from '@/features/matches/messages'
import { MatchNotFound } from '@/features/matches/components/MatchNotFound'
import { useAnimatedValue } from '@/features/matches/hooks/useAnimatedValue'
import { MATCH_IS_SAMPLE, useMatch } from '@/features/matches/queries'
import type { Match, MatchSide } from '@/features/matches/types'
import './verdict.css'

/** PV iniziali se il log non ha round (regolamento: 10). */
const STARTING_HP = 10

/**
 * Da quando parte un pezzo della sequenza d'ingresso (tempi in verdict.css).
 *
 * @param phase Fase della sequenza.
 * @param after Ritardo in più, in ms (es. un momento dopo l'altro).
 * @returns Lo stile con la variabile `--d`.
 */
const at = (
  phase: 'summary' | 'word' | 'phrase' | 'players' | 'moments' | 'actions',
  after = 0,
): CSSProperties =>
  ({
    '--d': after ? `calc(var(--verdict-${phase}) + ${after}ms)` : `var(--verdict-${phase})`,
  }) as CSSProperties

/** Colore della parola dell'esito (gen_ar.verdetto). */
const OUTCOME_COLORS = {
  WIN: 'text-nav-ink-active',
  LOSS: 'text-(--za-verdict-loss)',
  DRAW: 'text-text',
} as const

/**
 * Verdetto (S10, tavole Sfide-Verdetto, Sfide-Sconfitta, Sfide-Pareggio): la stessa arena del
 * Rotolo. In alto perché è finita, l'esito e la frase di Atropo; sulle pozze di luce i due
 * giocatori con i PV finali (chi perde è spento); sotto i momenti che hanno deciso la partita
 * e le azioni: Rivincita e Modifica il Cielo (l'eroica cambia con l'esito).
 *
 * Rispetto alla tavola mancano, finché il backend non li ha: la ricompensa in crediti davanti al
 * trono, la cascata dello spareggio e il riepilogo per creatura.
 */
export function MatchVerdictPage() {
  const { matchId } = useParams()
  const match = useMatch(Number(matchId))
  return match ? <MatchVerdict match={match} /> : <MatchNotFound />
}

/** Il Verdetto di una partita trovata. */
function MatchVerdict({ match }: { match: Match }) {
  const opponent: MatchSide = match.me === 'A' ? 'B' : 'A'
  const { word, phrase } = MATCH_COPY.outcome[match.outcome]
  const moments = keyMoments(match)
  const won = match.outcome === 'WIN'
  const rematchTo = newChallengePath(match.players[opponent].id)
  const loser: MatchSide | null =
    match.outcome === 'DRAW' ? null : match.outcome === 'WIN' ? opponent : match.me
  const role = (side: MatchSide) =>
    loser === null ? '' : side === loser ? 'verdict-loser' : 'verdict-winner'

  // I PV scendono dal valore d'inizio partita a quello finale, quando l'esito è chiaro.
  const firstRound = match.events.find((e) => e.type === 'ROUND')
  const startHp = firstRound?.type === 'ROUND' ? firstRound.hp : { A: STARTING_HP, B: STARTING_HP }
  const hpOf = (side: MatchSide) => ({
    to: match.finalHp[side],
    from: startHp[side],
    mode: 'count' as const,
    delay: 1500,
    duration: 700,
    speed: 1,
    active: true,
    runKey: match.id,
  })
  const myHp = useAnimatedValue(hpOf(match.me))
  const opponentHp = useAnimatedValue(hpOf(opponent))

  return (
    <main className="verdict relative flex min-h-dvh flex-col items-center gap-8 overflow-hidden px-4 pt-24 pb-10 md:block md:p-0">
      <title>{`${word} · Zodiax Arena`}</title>
      <ArenaBackdrop glow={won} />
      <ArenaTopBar
        backTo={PATHS.challenges}
        backLabel={MATCH_COPY.back}
        action={<SecondaryLink to={matchPath(match.id)}>{MATCH_COPY.replay}</SecondaryLink>}
      />

      <header className="flex flex-col items-center gap-3 text-center text-shadow-scene md:absolute md:inset-x-0 md:top-[11.5%]">
        <p
          className="verdict-fade type-eyebrow tracking-[0.12em] text-gold uppercase"
          style={at('summary')}
        >
          {endSummary(match)}
        </p>
        <h1
          style={at('word')}
          className={`verdict-word font-display text-[2.75rem] leading-none font-black tracking-[0.06em] uppercase md:text-[3.5rem] ${OUTCOME_COLORS[match.outcome]}`}
        >
          {word}
        </h1>
        <p className="verdict-fade text-text-soft italic type-body" style={at('phrase')}>
          {phrase} <span className="text-text-muted not-italic">· {MATCH_COPY.atropo}</span>
        </p>
      </header>

      <div className="flex gap-6 md:contents">
        <ArenaPlayer
          nickname={match.players[match.me].nickname}
          isMe
          faction={match.players[match.me].faction}
          hp={myHp}
          dimmed={match.outcome === 'LOSS'}
          style={at('players')}
          className={`verdict-rise ${role(match.me)} max-md:w-40 md:absolute md:top-[calc(54.2%-0.75rem)] md:left-[29.7%] md:-translate-x-1/2 md:-translate-y-[calc(100%-3.5rem)]`}
        />
        <ArenaPlayer
          nickname={match.players[opponent].nickname}
          faction={match.players[opponent].faction}
          hp={opponentHp}
          dimmed={won}
          style={at('players', 120)}
          className={`verdict-rise ${role(opponent)} max-md:w-40 md:absolute md:top-[calc(54.2%-0.75rem)] md:left-[70.1%] md:-translate-x-1/2 md:-translate-y-[calc(100%-3.5rem)]`}
        />
      </div>

      <section className="flex w-full flex-col items-center gap-10 md:absolute md:inset-x-0 md:top-[66%] md:bottom-8 md:justify-center">
        {moments.length > 0 && (
          <div className="flex w-full max-w-[57.75rem] flex-col gap-4">
            <h2
              className="verdict-fade type-eyebrow tracking-[0.12em] text-gold uppercase text-shadow-scene"
              style={at('moments')}
            >
              {MATCH_COPY.moments[match.outcome]}
            </h2>
            <ol className="relative flex flex-col gap-6 md:flex-row md:justify-between">
              <span
                aria-hidden="true"
                style={at('moments', 150)}
                className="verdict-thread absolute top-1.5 right-[9rem] left-[9rem] hidden h-px bg-(image:--za-verdict-thread) md:block"
              />
              {moments.map((moment, i) => (
                <li
                  key={`${moment.rounds}-${moment.lead}`}
                  style={at('moments', 250 + i * 180)}
                  className="verdict-fade relative flex flex-col items-center gap-2 text-center md:w-72"
                >
                  <span
                    aria-hidden="true"
                    style={at('moments', 250 + i * 180)}
                    className="verdict-pop size-3 rotate-45 bg-nav-ink-active shadow-[0_0_0_3px_#0B0E35,0_0_0_4px_rgba(232,176,75,0.7)]"
                  />
                  <span className="type-eyebrow tracking-[0.12em] text-gold uppercase">
                    Round {moment.rounds}
                  </span>
                  <span className="flex items-center gap-3 text-left">
                    <MatchCardImage card={moment.card} />
                    <span className="text-text text-shadow-scene type-meta">
                      {moment.lead} <b>{moment.card.name}</b>
                      {moment.tail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div
          className="verdict-rise flex flex-col-reverse items-center gap-4 sm:flex-row"
          style={at('actions')}
        >
          {won ? (
            <>
              <SecondaryLink to={PATHS.deck} className="w-58">
                {MATCH_COPY.editSky}
              </SecondaryLink>
              <GoldLink hero size="l" to={rematchTo} className="w-58">
                {MATCH_COPY.rematch}
              </GoldLink>
            </>
          ) : (
            <>
              <SecondaryLink to={rematchTo} className="w-58">
                {MATCH_COPY.rematch}
              </SecondaryLink>
              <GoldLink to={PATHS.deck} className="w-58">
                {MATCH_COPY.editSky}
              </GoldLink>
            </>
          )}
        </div>
      </section>
      {MATCH_IS_SAMPLE && <MockDataNotice />}
    </main>
  )
}
