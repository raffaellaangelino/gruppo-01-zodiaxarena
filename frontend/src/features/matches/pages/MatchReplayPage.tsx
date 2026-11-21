import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { MockDataNotice } from '@/app/shell/MockDataNotice'
import { PATHS, matchVerdictPath } from '@/app/paths'
import { ArenaBackdrop } from '@/components/arena/ArenaBackdrop'
import { ArenaTopBar } from '@/components/arena/ArenaTopBar'
import { GoldLink } from '@/components/ui/GoldButton'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import { MatchNotFound } from '@/features/matches/components/MatchNotFound'
import {
  ArenaCreatureCard,
  type OpenStat,
} from '@/features/matches/components/arena/ArenaCreatureCard'
import { ReplayChronicle } from '@/features/matches/components/arena/ReplayChronicle'
import { ReplayControls } from '@/features/matches/components/arena/ReplayControls'
import { ReplayPlate } from '@/features/matches/components/arena/ReplayPlate'
import { RoundSeal } from '@/features/matches/components/arena/RoundSeal'
import { RoundTrack } from '@/features/matches/components/arena/RoundTrack'
import { StatBreakdown } from '@/features/matches/components/arena/StatBreakdown'
import { useReplay } from '@/features/matches/hooks/useReplay'
import { MATCH_COPY } from '@/features/matches/messages'
import { MATCH_IS_SAMPLE, useMarkMatchSeen, useMatch } from '@/features/matches/queries'
import { buildReplay, firstStepOfRound } from '@/features/matches/replay'
import type { Match, MatchSide } from '@/features/matches/types'

const COPY = MATCH_COPY.arena

/**
 * Larghezza della carta in arena. Su desktop segue l'altezza dello schermo, così la carta resta
 * sotto la piastra e sopra la pozza di luce anche sugli schermi bassi (216 px a 900 di altezza).
 */
const CARD_WIDTH = 'w-[7.5rem] sm:w-[9.5rem] xl:w-[min(13.5rem,24dvh)]'

/**
 * Posizioni sulla key art dell'arena (come il Verdetto): le pozze di luce a 29,7% e 70,1%, a
 * 54,2% di altezza. La carta poggia sulla pozza: sale della sua altezza (larghezza × 1,4).
 */
const POOL_X: Record<'me' | 'opponent', string> = {
  me: 'xl:left-[29.7%]',
  opponent: 'xl:left-[70.1%]',
}
const CARD_TOP = 'xl:top-[calc(54.2%-min(18.9rem,33.6dvh)+0.375rem)]'

/**
 * Il Rotolo di Lachesi (S10, tavole Sfide-Rotolo e Sfide-Rotolo-Cronaca): la partita raccontata
 * nell'arena, un momento per volta. Se la partita non esiste o è di altri, l'avviso gentile.
 */
export function MatchReplayPage() {
  const { matchId } = useParams()
  const match = useMatch(Number(matchId))
  return match ? <MatchReplay match={match} /> : <MatchNotFound />
}

/** Il Racconto di una partita trovata: aprirlo la segna come vista. */
function MatchReplay({ match }: { match: Match }) {
  useMarkMatchSeen(match.id)
  const steps = useMemo(() => buildReplay(match), [match])
  const controls = useReplay(steps)
  const { step, atEnd, index, seek, pause } = controls
  const [chronicleOpen, setChronicleOpen] = useState(false)
  const [breakdown, setBreakdown] = useState<{ side: MatchSide; stat: OpenStat } | null>(null)

  const me = match.me
  const opponent: MatchSide = me === 'A' ? 'B' : 'A'
  const hpTotal = Math.max(steps[0].hp.A, steps[0].hp.B)
  const verdict = matchVerdictPath(match.id)
  const openCreature = breakdown ? step.creatures[breakdown.side] : null

  // Esc chiude il calcolo aperto.
  useEffect(() => {
    if (!breakdown) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setBreakdown(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [breakdown])

  /** Aprire un calcolo mette in pausa: chi legge i numeri non deve vederli cambiare. */
  const toggleStat = (side: MatchSide, stat: OpenStat) => {
    pause()
    setBreakdown((open) => (open?.side === side && open.stat === stat ? null : { side, stat }))
  }

  const seekRound = (round: number) => {
    const target = firstStepOfRound(steps, round)
    if (target >= 0) seek(target)
  }

  const plate = (side: MatchSide) => (
    <ReplayPlate
      player={match.players[side]}
      isMe={side === me}
      hp={step.hp[side]}
      hpLost={step.hpLost[side]}
      hpTotal={hpTotal}
      tokens={step.tokens[side]}
      mirror={side !== me}
    />
  )

  const creature = (side: MatchSide) => {
    const current = step.creatures[side]
    if (!current) return <div aria-hidden="true" className={`aspect-[5/7] ${CARD_WIDTH}`} />
    return (
      <ArenaCreatureCard
        creature={current}
        justFell={step.kind === 'clash' && current.fallen}
        openStat={breakdown?.side === side ? breakdown.stat : null}
        onToggleStat={(stat) => toggleStat(side, stat)}
        side={side === me ? 'left' : 'right'}
        className={CARD_WIDTH}
      />
    )
  }

  return (
    <main className="relative min-h-dvh overflow-hidden xl:h-dvh">
      <title>{`${MATCH_COPY.chronicleTitle} · Zodiax Arena`}</title>
      <ArenaBackdrop />
      <h1 className="sr-only">
        {COPY.title(match.players[me].nickname, match.players[opponent].nickname)}
      </h1>
      <ArenaTopBar
        backTo={PATHS.challenges}
        backLabel={COPY.exit}
        action={<SecondaryLink to={verdict}>{MATCH_COPY.skip}</SecondaryLink>}
      />

      {/* Mobile e tablet: in colonna, l'avversario in alto e chi guarda in basso.
          Desktop (xl): la composizione della tavola, sulle pozze di luce. */}
      <div className="flex flex-col items-center gap-5 px-4 pt-20 pb-8 xl:contents">
        <div className={`order-1 xl:absolute xl:top-[9.3%] xl:-translate-x-1/2 ${POOL_X.opponent}`}>
          {plate(opponent)}
        </div>

        <div className="order-2 flex items-start justify-center gap-2 sm:gap-6 xl:contents">
          <div className={`xl:absolute xl:-translate-x-1/2 ${CARD_TOP} ${POOL_X.me}`}>
            {creature(me)}
          </div>
          {/* A fine partita il blocco si appoggia dal basso e cresce verso l'alto: il pulsante
              resta tra le due carte, sopra i nomi e i bonus (che sono più larghi delle carte). */}
          <div
            className={`self-center pt-4 xl:absolute xl:left-1/2 xl:-translate-x-1/2 xl:pt-0 ${
              atEnd ? 'xl:bottom-[calc(45.8%+1.625rem)]' : 'xl:top-[calc(54.2%-7.375rem)]'
            }`}
          >
            <RoundSeal round={step.round} advantage={step.advantage}>
              {atEnd && (
                <GoldLink hero size="l" to={verdict} className="mt-3 hidden w-72 xl:inline-flex">
                  {MATCH_COPY.toVerdict}
                </GoldLink>
              )}
            </RoundSeal>
          </div>
          <div className={`xl:absolute xl:-translate-x-1/2 ${CARD_TOP} ${POOL_X.opponent}`}>
            {creature(opponent)}
          </div>
        </div>

        {/* Mobile e tablet: tra le carte non c'è spazio, il pulsante ha una riga sua */}
        {atEnd && (
          <GoldLink hero size="l" to={verdict} className="order-2 mt-2 w-72 xl:hidden">
            {MATCH_COPY.toVerdict}
          </GoldLink>
        )}

        <div className={`order-3 xl:absolute xl:top-[9.3%] xl:-translate-x-1/2 ${POOL_X.me}`}>
          {plate(me)}
        </div>

        {breakdown && openCreature && (
          <StatBreakdown
            creature={openCreature}
            stat={breakdown.stat}
            onClose={() => setBreakdown(null)}
            className={`fixed inset-x-4 bottom-24 z-20 sm:inset-x-auto sm:left-1/2 sm:w-72 sm:-translate-x-1/2 xl:absolute xl:top-[33%] xl:bottom-auto xl:w-62 ${
              breakdown.side === me
                ? 'xl:left-[calc(29.7%-min(6.75rem,12dvh)-1rem)] xl:-translate-x-full'
                : 'xl:left-[calc(70.1%+min(6.75rem,12dvh)+1rem)] xl:translate-x-0'
            }`}
          />
        )}

        <ReplayChronicle
          steps={steps}
          index={index}
          open={chronicleOpen}
          onToggle={() => setChronicleOpen((o) => !o)}
          onSeek={seek}
          className={`order-4 w-full max-w-[27.5rem] xl:absolute xl:bottom-6 xl:left-6 xl:z-10 ${
            chronicleOpen ? 'h-64 xl:h-71' : 'h-36 xl:h-49'
          }`}
        />

        <div className="order-5 mt-6 xl:absolute xl:top-[84.7%] xl:left-1/2 xl:mt-0 xl:-translate-x-1/2">
          <RoundTrack
            turn={step.turn}
            round={step.round}
            total={match.rounds}
            onSeekRound={seekRound}
          />
        </div>

        <div className="order-6 -translate-x-8 xl:absolute xl:bottom-8 xl:left-1/2 xl:-translate-x-1/2">
          <ReplayControls controls={controls} />
        </div>
      </div>

      {MATCH_IS_SAMPLE && <MockDataNotice />}
    </main>
  )
}
