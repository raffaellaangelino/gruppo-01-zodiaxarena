import { useState } from 'react'
import { Link, useParams } from 'react-router'
import moireUrl from '@/assets/images/moire.webp'
import { PATHS } from '@/app/paths'
import { ArenaBackdrop } from '@/components/arena/ArenaBackdrop'
import { ArenaPlayer } from '@/components/arena/ArenaPlayer'
import { WaitingOrbit } from '@/components/arena/WaitingOrbit'
import { FormAlert } from '@/components/ui/FormAlert'
import { GoldButton, GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { useAcceptChallenge } from '@/features/challenges/hooks/useAcceptChallenge'
import { ACCEPT_COPY } from '@/features/challenges/messages'
import { useChallenges } from '@/features/challenges/queries'
import { usePlayerSummary } from '@/features/player/queries'

/**
 * Dopo "Accetta e gioca" (F05, tavole Sfide-Attesa e Sfide-Stati): l'arena a schermo intero, i due
 * giocatori sulle pozze di luce (l'avversario con la Fazione ancora da scoprire), l'orbita che gira e
 * "Cloto fila la vostra partita…". L'attesa dura quanto il server; a partita pronta si passa al Rotolo.
 * Se non riesce, al posto del racconto c'è cosa è successo e cosa fare (Riprova, Correggi il Cielo).
 */
export function PlayChallengePage() {
  const { challengeId } = useParams()
  const player = usePlayerSummary()
  const toPlay = useChallenges('TO_PLAY')
  // La sfida com'era all'apertura: dopo l'accettazione la lista cambia, la scena no.
  const [challenge] = useState(() =>
    toPlay.find((c) => c.id === Number(challengeId) && c.status === 'PENDING'),
  )
  const deckId = player.deckIds[0] ?? null
  const { failure, retry } = useAcceptChallenge(challenge?.id ?? null, deckId)

  const problem = !challenge ? 'notPending' : deckId === null ? 'noDeck' : failure
  const opponent = challenge?.opponent

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 overflow-hidden px-4 pt-20 pb-10 md:block md:p-0">
      <title>Cloto fila la partita · Zodiax Arena</title>
      <ArenaBackdrop />
      <Link
        to={PATHS.challenges}
        className="absolute top-6 left-4 z-10 flex items-center gap-2 text-gold-bright no-underline type-meta-strong md:left-8"
      >
        <Icon name="indietro" size={16} />
        {ACCEPT_COPY.exit}
      </Link>

      <ArenaPlayer
        nickname={player.nickname}
        isMe
        faction={player.faction}
        className="md:absolute md:top-[calc(54.2%-0.75rem)] md:left-[29.7%] md:-translate-x-1/2 md:-translate-y-full"
      />
      {opponent && !problem && (
        <WaitingOrbit
          label={ACCEPT_COPY.orbit(player.nickname, opponent.nickname)}
          className="md:absolute md:top-[calc(54.2%-6.25rem)] md:left-1/2 md:-translate-x-1/2"
        />
      )}
      {opponent && (
        <ArenaPlayer
          nickname={opponent.nickname}
          faction={null}
          className="md:absolute md:top-[calc(54.2%-0.75rem)] md:left-[70.1%] md:-translate-x-1/2 md:-translate-y-full"
        />
      )}

      <section className="flex w-full max-w-3xl flex-col items-center gap-3 text-center text-shadow-scene md:absolute md:top-[69.3%] md:left-1/2 md:-translate-x-1/2">
        {problem ? (
          <>
            <h1 className="sr-only">{ACCEPT_COPY.title}</h1>
            <FormAlert>{ACCEPT_COPY.failures[problem]}</FormAlert>
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              {(problem === 'engine' || problem === 'network' || problem === 'server') && (
                <GoldButton onClick={retry} className="w-58">
                  {ACCEPT_COPY.retry}
                </GoldButton>
              )}
              {(problem === 'deckInvalid' || problem === 'noDeck') && (
                <GoldLink to={PATHS.deck} className="w-58">
                  {ACCEPT_COPY.fixSky}
                </GoldLink>
              )}
              <Link to={PATHS.challenges} className="text-gold-bright type-meta-strong">
                {ACCEPT_COPY.exit}
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <img
                src={moireUrl}
                alt="Le Moire"
                width={56}
                height={56}
                className="shrink-0 rounded-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              />
              <h1 className="text-text type-h1-m md:type-h1">{ACCEPT_COPY.title}</h1>
            </div>
            <p aria-live="polite" className="text-text-soft type-body">
              {ACCEPT_COPY.text}
            </p>
          </>
        )}
      </section>
    </main>
  )
}
