import { newChallengePath } from '@/app/paths'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { TertiaryLink } from '@/components/ui/TertiaryButton'
import { CHALLENGES_COPY } from '@/features/challenges/messages'
import type { Challenge } from '@/features/challenges/types'

/** Proprietà di {@link GoneNotice}. */
export interface GoneNoticeProps {
  /** La sfida che non è più in attesa. */
  challenge: Challenge
}

/**
 * Sfida sparita mentre rispondevi (tavola Sfide-Stati): l'avversario l'ha ritirata prima della
 * tua risposta. Dice cosa è successo e offre di sfidarlo tu.
 */
export function GoneNotice({ challenge }: GoneNoticeProps) {
  const { opponent } = challenge
  return (
    <TilePanel glass as="div">
      <output className="flex flex-wrap items-center gap-4 px-6 py-4">
        <Icon name="info" size={20} className="shrink-0 text-text-muted" />
        <p className="min-w-0 flex-1 text-text-muted type-meta">
          {CHALLENGES_COPY.gone(opponent.nickname)}
        </p>
        <TertiaryLink to={newChallengePath(opponent.id)} icon="sfide">
          {CHALLENGES_COPY.challenge}
        </TertiaryLink>
      </output>
    </TilePanel>
  )
}
