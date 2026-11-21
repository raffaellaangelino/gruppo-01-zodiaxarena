import { Outlet } from 'react-router'
import { PATHS, newChallengePath } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { PageTabs } from '@/components/navigation/PageTabs'
import { GoldLink } from '@/components/ui/GoldButton'
import { CHALLENGES_COPY } from '@/features/challenges/messages'
import { useChallenges } from '@/features/challenges/queries'

/**
 * Cornice della sezione Sfide (tavole Sfide e Sfide-Inviate): titolo, schede "Da giocare" e
 * "Inviate", "Nuova sfida" a destra; sotto, la scheda aperta. Lo Storico arriva con il suo
 * endpoint (contratto API §8.1).
 */
export function ChallengesLayout() {
  const toPlay = useChallenges('TO_PLAY')
  const pending = toPlay.filter((c) => c.status === 'PENDING').length

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 pt-(--shell-top) pb-(--shell-bottom) xl:px-8">
      <title>Sfide · Zodiax Arena</title>
      <PorticoBackdrop />
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 pt-6 xl:pt-8">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-2">
          <h1 className="text-text type-h1-m xl:type-h1">{CHALLENGES_COPY.title}</h1>
          <PageTabs
            label="Sezioni delle sfide"
            tabs={[
              { to: PATHS.challenges, label: CHALLENGES_COPY.tabs.toPlay, count: pending },
              { to: PATHS.challengesSent, label: CHALLENGES_COPY.tabs.sent },
            ]}
          />
        </div>
        <GoldLink to={newChallengePath()} className="w-50 max-sm:w-full">
          {CHALLENGES_COPY.newChallenge}
        </GoldLink>
      </header>
      <div className="mt-6 pb-10">
        <Outlet />
      </div>
    </main>
  )
}
