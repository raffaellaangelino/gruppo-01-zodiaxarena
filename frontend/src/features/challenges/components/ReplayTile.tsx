import { matchPath } from '@/app/paths'
import { TilePanel } from '@/components/panels/TilePanel'
import { GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import { daysAgoLabel } from '@/lib/dates'
import { CHALLENGES_COPY } from '@/features/challenges/messages'
import type { Challenge } from '@/features/challenges/types'

/** Proprietà di {@link ReplayTile}. */
export interface ReplayTileProps {
  /** Sfida ricevuta già giocata, con la partita (`matchId`). */
  challenge: Challenge & { matchId: number }
}

/**
 * Rotolo da guardare (tavola Sfide): una sfida che hai accettato e giocato ma di cui non hai
 * ancora visto il racconto. L'esito resta nascosto finché non lo guardi (niente anticipazioni).
 */
export function ReplayTile({ challenge }: ReplayTileProps) {
  return (
    <TilePanel glass as="article" aria-label={CHALLENGES_COPY.replayToWatch}>
      <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-4">
          <span aria-hidden="true">
            <Medallion size={56}>
              <Icon name="rotolo" size={24} className="text-gold-bright" />
            </Medallion>
          </span>
          <div className="flex flex-col gap-1">
            <p className="type-eyebrow tracking-[0.1em] text-gold uppercase">
              {CHALLENGES_COPY.replayToWatch}
            </p>
            <p className="type-h3 text-text">
              {CHALLENGES_COPY.against(challenge.opponent.nickname)}
            </p>
            <p className="text-text-muted type-meta">
              giocata {daysAgoLabel(challenge.createdAt)} · {CHALLENGES_COPY.replayHint}
            </p>
          </div>
        </div>
        <GoldLink to={matchPath(challenge.matchId)} className="sm:w-62">
          {CHALLENGES_COPY.watchReplay}
        </GoldLink>
      </div>
    </TilePanel>
  )
}
