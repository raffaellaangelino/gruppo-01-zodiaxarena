import { LineTitle } from '@/components/ui/LineTitle'
import { ChallengesEmptyState } from '@/features/challenges/components/ChallengesEmptyState'
import { GoneNotice } from '@/features/challenges/components/GoneNotice'
import { ReceivedChallengeTile } from '@/features/challenges/components/ReceivedChallengeTile'
import { RematchPanel } from '@/features/challenges/components/RematchPanel'
import { ReplayTile } from '@/features/challenges/components/ReplayTile'
import { useChallengeAction } from '@/features/challenges/hooks/useChallengeAction'
import { CHALLENGES_COPY } from '@/features/challenges/messages'
import { recentOpponents } from '@/features/challenges/opponents'
import { useChallenges } from '@/features/challenges/queries'
import type { Challenge } from '@/features/challenges/types'
import { useMyDeck } from '@/features/decks/queries'

/** Sfida giocata con la sua partita: si può aprire il Rotolo. */
const hasMatch = (c: Challenge): c is Challenge & { matchId: number } => c.matchId !== null

/**
 * Sfide · Da giocare (S09, tavole Sfide, Sfide-Vuota, Sfide-Stati): le sfide ricevute da accettare
 * o rifiutare, i Rotoli delle partite giocate da guardare e, a destra, "Sfida di nuovo".
 * Se non c'è niente da fare, lo stato vuoto con "Nuova sfida".
 *
 * Mancano finché il backend non li ha: "Ultime partite" (storico, contratto API §8.1) e
 * "Sfide premiate oggi" (premi, dopo il SAL).
 */
export function ChallengesToPlayPage() {
  const toPlay = useChallenges('TO_PLAY')
  const sent = useChallenges('SENT')
  const decline = useChallengeAction('decline')
  const { deck } = useMyDeck()

  const received = toPlay.filter((c) => c.status === 'PENDING')
  const replays = toPlay.filter((c) => c.status === 'PLAYED').filter(hasMatch)
  const gone = decline.failure === 'gone' ? decline.failed : null

  if (received.length === 0 && replays.length === 0 && !gone) {
    return <ChallengesEmptyState {...CHALLENGES_COPY.emptyToPlay} withAction />
  }

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_27rem]">
      <section aria-labelledby="ti-aspettano" className="flex flex-col gap-4">
        <div id="ti-aspettano">
          <LineTitle stretch textClassName="type-h2">
            {CHALLENGES_COPY.waiting}
          </LineTitle>
        </div>
        {gone && <GoneNotice challenge={gone} />}
        {received.map((challenge) => (
          <ReceivedChallengeTile
            key={challenge.id}
            challenge={challenge}
            deck={deck}
            onDecline={() => decline.run(challenge)}
            declining={decline.pendingId === challenge.id}
            error={
              decline.failure === 'failed' && decline.failed?.id === challenge.id
                ? CHALLENGES_COPY.actionFailed
                : undefined
            }
          />
        ))}
        {replays.map((challenge) => (
          <ReplayTile key={challenge.id} challenge={challenge} />
        ))}
      </section>
      <RematchPanel opponents={recentOpponents([...toPlay, ...sent])} />
    </div>
  )
}
