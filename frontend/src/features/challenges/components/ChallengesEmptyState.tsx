import { newChallengePath } from '@/app/paths'
import { GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { CHALLENGES_COPY } from '@/features/challenges/messages'

/** Proprietà di {@link ChallengesEmptyState}. */
export interface ChallengesEmptyStateProps {
  title: string
  text: string
  /** Mostra il pulsante eroico "Nuova sfida" (solo dove è l'unica azione della schermata). */
  withAction?: boolean
}

/**
 * Lista vuota delle sfide (tavola Sfide-Vuota): il sigillo di Ermes senza lettere, un titolo,
 * cosa fare, e "Nuova sfida".
 */
export function ChallengesEmptyState({
  title,
  text,
  withAction = false,
}: ChallengesEmptyStateProps) {
  return (
    <section className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <span
        aria-hidden="true"
        className="flex size-30 items-center justify-center rounded-full border border-dashed border-gold-bright/35 bg-bg-deep/50 text-gold-bright/50"
      >
        <Icon name="sfide" size={48} />
      </span>
      <h2 className="type-h2 tracking-[0.08em] text-text uppercase">{title}</h2>
      <p className="max-w-[28.75rem] text-text-muted type-body">{text}</p>
      {withAction && (
        <GoldLink hero size="l" to={newChallengePath()} className="mt-2 w-64">
          {CHALLENGES_COPY.newChallenge}
        </GoldLink>
      )}
    </section>
  )
}
