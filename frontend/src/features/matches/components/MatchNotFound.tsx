import { PATHS } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { Icon } from '@/components/ui/Icon'
import { SecondaryLink } from '@/components/ui/SecondaryButton'
import { MATCH_COPY } from '@/features/matches/messages'

/**
 * Partita che non esiste o di altri giocatori (S10, stati: «404 gentile»). Non offre "Riprova",
 * che non cambierebbe nulla: dice cosa succede e riporta alle sfide.
 */
export function MatchNotFound() {
  return (
    <main className="relative grid min-h-dvh place-content-center px-4">
      <title>{`${MATCH_COPY.notFound.title} · Zodiax Arena`}</title>
      <PorticoBackdrop />
      <section className="flex flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="flex size-30 items-center justify-center rounded-full border border-dashed border-gold-bright/35 bg-bg-deep/50 text-gold-bright/50"
        >
          <Icon name="rotolo" size={48} />
        </span>
        <h1 className="type-h2 tracking-[0.08em] text-text uppercase">
          {MATCH_COPY.notFound.title}
        </h1>
        <p className="max-w-[28.75rem] text-text-muted type-body">{MATCH_COPY.notFound.text}</p>
        <SecondaryLink to={PATHS.challenges} className="mt-2">
          {MATCH_COPY.back}
        </SecondaryLink>
      </section>
    </main>
  )
}
