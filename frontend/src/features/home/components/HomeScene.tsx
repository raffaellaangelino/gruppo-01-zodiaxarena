import { PATHS } from '@/app/paths'
import { GoldLink } from '@/components/ui/GoldButton'
import type { Progress } from '@/domain/game'
import { RewardedChallenges } from '@/features/home/components/RewardedChallenges'
import { SCENE_COPY } from '@/features/home/messages'

/** Proprietà di {@link HomeScene}. */
export interface HomeSceneProps {
  /** Mobile: titolo più piccolo, racconto in una riga, pulsante a tutta larghezza. */
  compact: boolean
  /** Sfide premiate oggi; `null` finché il backend non le manda (allora non si mostrano). */
  rewarded: Progress | null
}

/**
 * Scena della Home (D-021): sopratitolo, titolo eroico, una frase di lore, "Nuova sfida"
 * (l'unica azione eroica della schermata) e le sfide premiate di oggi.
 */
export function HomeScene({ compact, rewarded }: HomeSceneProps) {
  return (
    <section aria-labelledby="home-title" className="flex max-w-117.5 flex-col gap-3 xl:gap-4">
      <p className="type-label text-gold text-shadow-scene xl:type-eyebrow">{SCENE_COPY.eyebrow}</p>
      <h1
        id="home-title"
        className="text-text uppercase text-shadow-hero type-display-m xl:type-display"
      >
        {SCENE_COPY.title[0]}
        <br />
        {SCENE_COPY.title[1]}
      </h1>
      <p className="text-text text-shadow-scene type-lore-m xl:type-lore">
        {compact ? SCENE_COPY.loreShort : SCENE_COPY.lore}
      </p>
      <GoldLink hero size="l" to={PATHS.newChallenge} className="mt-1 w-full xl:mt-2 xl:w-64">
        {SCENE_COPY.newChallenge}
      </GoldLink>
      {rewarded && (
        <RewardedChallenges
          progress={rewarded}
          width={compact ? 86 : 92}
          className={compact ? 'justify-center' : ''}
        />
      )}
    </section>
  )
}
