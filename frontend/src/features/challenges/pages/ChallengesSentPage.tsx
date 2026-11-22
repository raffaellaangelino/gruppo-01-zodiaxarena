import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { LineTitle } from '@/components/ui/LineTitle'
import { ChallengesEmptyState } from '@/features/challenges/components/ChallengesEmptyState'
import { SentChallengeRow } from '@/features/challenges/components/SentChallengeRow'
import { useChallengeAction } from '@/features/challenges/hooks/useChallengeAction'
import type { ChallengeLaunchedState } from '@/features/challenges/hooks/useCreateChallenge'
import { CHALLENGES_COPY, NEW_CHALLENGE_COPY } from '@/features/challenges/messages'
import { useChallenges } from '@/features/challenges/queries'
import type { Challenge } from '@/features/challenges/types'

/**
 * Sfide · Inviate (S09, tavola Sfide-Inviate): in attesa di risposta, con Ritira, e chiuse di
 * recente con il motivo. Dopo un lancio riuscito, in alto la conferma.
 */
export function ChallengesSentPage() {
  const sent = useChallenges('SENT')
  const location = useLocation()
  const navigate = useNavigate()
  // La conferma del lancio si legge una volta: poi si toglie dallo stato della navigazione, così
  // non ricompare ricaricando la pagina quando la sfida è già stata giocata.
  const [launchedTo] = useState(() => (location.state as ChallengeLaunchedState | null)?.launchedTo)
  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null })
  }, [location.state, location.pathname, navigate])
  const withdraw = useChallengeAction('withdraw')

  const pending = sent.filter((c) => c.status === 'PENDING')
  const closed = sent.filter((c) => c.status !== 'PENDING')

  if (sent.length === 0) return <ChallengesEmptyState {...CHALLENGES_COPY.emptySent} />

  const errorFor = (challenge: Challenge) => {
    if (withdraw.failed?.id !== challenge.id) return undefined
    return withdraw.failure === 'gone'
      ? `${challenge.opponent.nickname} ha già risposto: la sfida non è più in attesa.`
      : CHALLENGES_COPY.actionFailed
  }

  const section = (title: string, items: Challenge[]) =>
    items.length > 0 && (
      // Alto quanto il contenuto; se le sfide sono tante si ferma al bordo dello schermo e la lista
      // scorre dentro il pannello, con il titolo fermo (catena flex: niente altezze in percentuale)
      <TilePanel
        glass
        aria-label={title}
        className="flex min-h-0 flex-[0_1_auto] flex-col [&>.tile-panel\_\_content]:flex [&>.tile-panel\_\_content]:min-h-0 [&>.tile-panel\_\_content]:flex-1 [&>.tile-panel\_\_content]:flex-col"
      >
        <div className="flex min-h-0 flex-1 flex-col px-6 pt-5 pb-2">
          {/* Il titolo a linea con stretch ha flex-1: in una colonna crescerebbe in altezza */}
          <div className="flex shrink-0">
            <LineTitle stretch>{title}</LineTitle>
          </div>
          {/* La lista entra nei margini del pannello con un'imbottitura uguale: a destra la barra di
              scorrimento sta verso la cornice, staccata dai pulsanti; a sinistra l'anello dell'avatar non si taglia */}
          <ul className="mt-2 -mr-3 -ml-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-3 pl-2">
            {items.map((challenge) => (
              <SentChallengeRow
                key={challenge.id}
                challenge={challenge}
                onWithdraw={() => withdraw.run(challenge)}
                withdrawing={withdraw.pendingId === challenge.id}
                error={errorFor(challenge)}
              />
            ))}
          </ul>
        </div>
      </TilePanel>
    )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      {launchedTo && (
        <output className="flex items-center gap-2 text-success type-meta-strong">
          <Icon name="conferma" size={18} />
          {NEW_CHALLENGE_COPY.launched(launchedTo)}
        </output>
      )}
      {section(CHALLENGES_COPY.pendingSection, pending)}
      {section(CHALLENGES_COPY.closedSection, closed)}
    </div>
  )
}
