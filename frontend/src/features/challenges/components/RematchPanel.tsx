import { Link } from 'react-router'
import { PATHS, newChallengePath } from '@/app/paths'
import { PlayerAvatar } from '@/components/game/PlayerAvatar'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { LineTitle } from '@/components/ui/LineTitle'
import { TertiaryLink } from '@/components/ui/TertiaryButton'
import { shortDateLabel } from '@/lib/dates'
import { CHALLENGES_COPY } from '@/features/challenges/messages'
import type { RecentOpponent } from '@/features/challenges/opponents'

/** Proprietà di {@link RematchPanel}. */
export interface RematchPanelProps {
  opponents: RecentOpponent[]
  className?: string
}

/**
 * "Sfida di nuovo" (tavola Sfide, colonna destra): la ricerca, che apre Nuova sfida, e gli
 * avversari recenti con "Sfida", oppure "In attesa" se una sfida con loro è già aperta
 * (una sola sfida in attesa per coppia, contratto API §7).
 *
 * Il gruppo e le statistiche "con te" della tavola arrivano con i loro endpoint (§10.2, §10.5).
 */
export function RematchPanel({ opponents, className = '' }: RematchPanelProps) {
  return (
    <TilePanel glass aria-label={CHALLENGES_COPY.rematch} className={className}>
      <div className="flex flex-col px-6 pt-5 pb-3">
        <LineTitle stretch>{CHALLENGES_COPY.rematch}</LineTitle>
        <Link
          to={newChallengePath()}
          className="mt-3 mb-2 flex h-11 items-center gap-2 rounded-pill bg-field-bg px-4 text-text-muted no-underline inset-ring inset-ring-text/20 type-body hover:inset-ring-field-border-focus"
        >
          <Icon name="cerca" size={18} />
          {CHALLENGES_COPY.search}
        </Link>
        {opponents.length > 0 && (
          <>
            <p className="mt-2 type-eyebrow tracking-[0.1em] text-gold uppercase">
              {CHALLENGES_COPY.recentOpponents}
            </p>
            <ul className="mt-1">
              {opponents.map(({ player, pending, lastAt }) => (
                <li
                  key={player.id}
                  className="flex items-center gap-3 border-t border-line-soft py-3"
                >
                  <PlayerAvatar player={player} size={40} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-text type-body-strong">{player.nickname}</span>
                    <span className="text-text-muted type-meta">
                      {pending ? 'sfida in attesa' : `ultima sfida ${shortDateLabel(lastAt)}`}
                    </span>
                  </span>
                  {pending ? (
                    <Link
                      to={pending.direction === 'SENT' ? PATHS.challengesSent : PATHS.challenges}
                      className="flex items-center gap-1.5 whitespace-nowrap text-text-muted no-underline type-meta-strong hover:text-text"
                    >
                      <Icon name="scadenza" size={16} />
                      {CHALLENGES_COPY.pendingWith} ›
                    </Link>
                  ) : (
                    <TertiaryLink
                      to={newChallengePath(player.id)}
                      icon="sfide"
                      aria-label={`Sfida ${player.nickname}`}
                    >
                      {CHALLENGES_COPY.challenge}
                    </TertiaryLink>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </TilePanel>
  )
}
