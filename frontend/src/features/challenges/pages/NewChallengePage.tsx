import { useId, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { PATHS } from '@/app/paths'
import { Dialog } from '@/components/overlay/Dialog'
import { FormAlert } from '@/components/ui/FormAlert'
import { GoldButton } from '@/components/ui/GoldButton'
import { SearchField } from '@/components/ui/SearchField'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import type { PlayerRef } from '@/domain/game'
import { shortDateLabel } from '@/lib/dates'
import { ChallengeSummary } from '@/features/challenges/components/ChallengeSummary'
import { OpponentList, type OpponentOption } from '@/features/challenges/components/OpponentList'
import { useCreateChallenge } from '@/features/challenges/hooks/useCreateChallenge'
import { NEW_CHALLENGE_COPY } from '@/features/challenges/messages'
import { recentOpponents } from '@/features/challenges/opponents'
import { ChallengesToPlayPage } from '@/features/challenges/pages/ChallengesToPlayPage'
import { useChallenges } from '@/features/challenges/queries'
import { useMyDeck } from '@/features/decks/queries'
import { usePlayerSummary } from '@/features/player/queries'
import { PLAYER_SEARCH_AVAILABLE, usePlayerSearch } from '@/features/players/hooks/usePlayerSearch'

/**
 * Nuova sfida (F04, tavola Sfide-Nuova): una finestra sopra "Da giocare". A sinistra si sceglie
 * l'avversario, cercandolo per nome o tra quelli recenti; a destra il riepilogo e "Lancia la sfida".
 * Da "Sfida" in una lista arriva con l'avversario già scelto (`?avversario=id`).
 *
 * Il gruppo e "Allenati con Ermes" della tavola arrivano con i loro endpoint: l'allenamento oggi
 * non salva la partita (id fisso) e il suo mazzo non è valido per l'engine.
 */
export function NewChallengePage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const player = usePlayerSummary()
  const toPlay = useChallenges('TO_PLAY')
  const sent = useChallenges('SENT')
  const [query, setQuery] = useState('')
  const search = usePlayerSearch(query)
  const { launch, launching, failure, reset } = useCreateChallenge()
  const groupName = useId()

  const recents = recentOpponents([...toPlay, ...sent], 6)
  const preselectedId = Number(params.get('avversario')) || null
  const preselected =
    recents.find((r) => r.player.id === preselectedId && !r.pending)?.player ?? null
  const [opponent, setOpponent] = useState<PlayerRef | null>(preselected)

  const sky = useMyDeck()
  const { deckId } = sky
  // Il backend dice che il Cielo non è valido: non si lancia (lo rifiuterebbe con DECK_INVALID).
  const skyInvalid = sky.deck?.valid === false
  const close = () => void navigate(PATHS.challenges, { replace: true })

  const choose = (next: PlayerRef) => {
    setOpponent(next)
    reset()
  }

  // Chi è già tra i risultati della ricerca non si ripete tra i recenti: una sola riga per giocatore.
  const foundIds = new Set(search.results.map((r) => r.player.id))
  const recentOptions: OpponentOption[] = recents
    .filter(({ player: p }) => !foundIds.has(p.id))
    .map(({ player: p, pending, lastAt }) => ({
      player: p,
      meta: pending ? undefined : `ultima sfida ${shortDateLabel(lastAt)}`,
      pendingHref: pending
        ? pending.direction === 'SENT'
          ? PATHS.challengesSent
          : PATHS.challenges
        : undefined,
    }))
  const resultOptions: OpponentOption[] = search.results.map(
    ({ player: p, pendingChallengeId }) => ({
      player: p,
      pendingHref: pendingChallengeId ? PATHS.challengesSent : undefined,
    }),
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (opponent && deckId !== null && !skyInvalid && !launching) launch({ opponent, deckId })
  }

  return (
    <>
      <ChallengesToPlayPage />
      <Dialog label={NEW_CHALLENGE_COPY.title} onClose={close}>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 px-5 py-8 md:flex-row md:px-12 md:py-10"
        >
          <section className="flex flex-col gap-4 md:w-[26.25rem] md:shrink-0">
            <h2 className="pr-12 text-text type-h1-m md:type-h1">{NEW_CHALLENGE_COPY.title}</h2>
            {PLAYER_SEARCH_AVAILABLE ? (
              <>
                <SearchField
                  label={NEW_CHALLENGE_COPY.search}
                  placeholder={NEW_CHALLENGE_COPY.search}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query.trim() && !search.active && (
                  <p className="text-text-muted type-meta">{NEW_CHALLENGE_COPY.searchHint}</p>
                )}
                {search.active && search.searching && (
                  <p className="text-text-muted type-meta">{NEW_CHALLENGE_COPY.searching}</p>
                )}
                {search.failed && <FormAlert>{NEW_CHALLENGE_COPY.searchFailed}</FormAlert>}
                {search.active &&
                  !search.searching &&
                  !search.failed &&
                  (resultOptions.length > 0 ? (
                    <OpponentList
                      title={NEW_CHALLENGE_COPY.results}
                      name={groupName}
                      options={resultOptions}
                      selectedId={opponent?.id ?? null}
                      onSelect={choose}
                    />
                  ) : (
                    <p className="text-text-muted type-meta">
                      {NEW_CHALLENGE_COPY.noResults(query.trim())}
                    </p>
                  ))}
              </>
            ) : (
              recentOptions.length > 0 && (
                <p className="text-text-muted type-meta">{NEW_CHALLENGE_COPY.searchUnavailable}</p>
              )
            )}
            {recentOptions.length > 0 ? (
              <OpponentList
                title={NEW_CHALLENGE_COPY.recent}
                name={groupName}
                options={recentOptions}
                selectedId={opponent?.id ?? null}
                onSelect={choose}
              />
            ) : (
              !PLAYER_SEARCH_AVAILABLE && (
                <p className="text-text-muted type-meta">{NEW_CHALLENGE_COPY.noRecent}</p>
              )
            )}
          </section>

          <section className="flex flex-1 flex-col md:border-l md:border-gold/20 md:pl-8">
            <h3 className="type-eyebrow tracking-[0.12em] text-gold uppercase">
              {NEW_CHALLENGE_COPY.summary}
            </h3>
            <div className="mt-2">
              <ChallengeSummary opponent={opponent} faction={player.faction} sky={sky} />
            </div>
            <div className="mt-auto flex flex-col gap-3 pt-6">
              {deckId === null && <FormAlert>{NEW_CHALLENGE_COPY.noDeck}</FormAlert>}
              {skyInvalid && <FormAlert>{NEW_CHALLENGE_COPY.failures.deckInvalid}</FormAlert>}
              {failure && <FormAlert>{NEW_CHALLENGE_COPY.failures[failure]}</FormAlert>}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <SecondaryButton onClick={close}>{NEW_CHALLENGE_COPY.cancel}</SecondaryButton>
                <GoldButton
                  type="submit"
                  disabled={!opponent || deckId === null || skyInvalid}
                  busy={launching}
                  className="sm:w-58"
                >
                  {launching ? NEW_CHALLENGE_COPY.launching : NEW_CHALLENGE_COPY.launch}
                </GoldButton>
              </div>
            </div>
          </section>
        </form>
      </Dialog>
    </>
  )
}
