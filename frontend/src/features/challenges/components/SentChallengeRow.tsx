import { matchPath, newChallengePath } from '@/app/paths'
import { PlayerAvatar } from '@/components/game/PlayerAvatar'
import { FormAlert } from '@/components/ui/FormAlert'
import { Icon } from '@/components/ui/Icon'
import { TertiaryButton, TertiaryLink } from '@/components/ui/TertiaryButton'
import { CHALLENGES_COPY, sentStatusView } from '@/features/challenges/messages'
import type { Challenge } from '@/features/challenges/types'

/** Proprietà di {@link SentChallengeRow}. */
export interface SentChallengeRowProps {
  challenge: Challenge
  onWithdraw: () => void
  withdrawing: boolean
  error?: string
}

const TONE_CLASSES = {
  gold: 'text-gold-bright',
  muted: 'text-text-muted',
  warning: 'text-warning',
} as const

/**
 * Riga di una sfida inviata (tavola Sfide-Inviate): avversario, stato con icona e nome (mai
 * solo il colore), spiegazione con la data e l'azione che ha senso in quello stato:
 * Ritira se è in attesa, Sfida di nuovo se è stata rifiutata o è scaduta, Guarda se è stata giocata.
 */
export function SentChallengeRow({
  challenge,
  onWithdraw,
  withdrawing,
  error,
}: SentChallengeRowProps) {
  const { opponent } = challenge
  const view = sentStatusView(challenge)
  const canRematch = ['DECLINED', 'EXPIRED', 'WITHDRAWN'].includes(challenge.status)

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-soft py-4">
      <PlayerAvatar player={opponent} size={40} />
      <span className="w-28 truncate text-text type-body-strong sm:w-36">{opponent.nickname}</span>
      <span
        className={`flex w-32 items-center gap-1.5 type-meta-strong sm:w-36 ${TONE_CLASSES[view.tone]}`}
      >
        <Icon name={view.icon} size={16} />
        {view.label}
      </span>
      <span className="min-w-0 basis-full text-text-muted type-meta md:flex-1 md:basis-auto">
        {view.detail}
      </span>
      <span className="ml-auto flex items-center">
        {challenge.status === 'PENDING' && (
          <TertiaryButton
            tone="risk"
            icon="chiudi"
            onClick={onWithdraw}
            disabled={withdrawing}
            aria-label={`${CHALLENGES_COPY.withdraw} la sfida a ${opponent.nickname}`}
          >
            {CHALLENGES_COPY.withdraw}
          </TertiaryButton>
        )}
        {canRematch && (
          <TertiaryLink
            to={newChallengePath(opponent.id)}
            icon="sfide"
            aria-label={`Sfida di nuovo ${opponent.nickname}`}
          >
            {CHALLENGES_COPY.challenge}
          </TertiaryLink>
        )}
        {challenge.status === 'PLAYED' && challenge.matchId !== null && (
          <TertiaryLink
            to={matchPath(challenge.matchId)}
            icon="rotolo"
            aria-label={`Guarda il Rotolo contro ${opponent.nickname}`}
          >
            Guarda
          </TertiaryLink>
        )}
      </span>
      {error && (
        <div className="basis-full">
          <FormAlert>{error}</FormAlert>
        </div>
      )}
    </li>
  )
}
