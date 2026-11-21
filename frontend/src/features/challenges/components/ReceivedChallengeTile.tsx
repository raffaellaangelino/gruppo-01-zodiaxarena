import { PATHS, playChallengePath } from '@/app/paths'
import { CardFan } from '@/components/game/CardFan'
import { DeckValidity } from '@/components/game/DeckValidity'
import { PlayerAvatar } from '@/components/game/PlayerAvatar'
import { TilePanel } from '@/components/panels/TilePanel'
import { FormAlert } from '@/components/ui/FormAlert'
import { GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { TertiaryButton } from '@/components/ui/TertiaryButton'
import { cardThumb } from '@/features/cards/thumb'
import { CHALLENGES_COPY, challengeTiming } from '@/features/challenges/messages'
import type { Challenge } from '@/features/challenges/types'
import type { Deck } from '@/features/decks/types'

/** Proprietà di {@link ReceivedChallengeTile}. */
export interface ReceivedChallengeTileProps {
  challenge: Challenge
  /** Il Cielo con cui risponderesti; `null` finché non arriva (si accetta lo stesso). */
  deck: Deck | null
  onDecline: () => void
  /** Il rifiuto è in corso. */
  declining: boolean
  /** Messaggio se il rifiuto non è riuscito. */
  error?: string
}

/**
 * Sfida ricevuta (tavole Sfide e Sfide-Stati, "Ti aspettano"): chi ti ha sfidato a sinistra, con
 * cosa giocherai a destra (il ventaglio del tuo Cielo con la sua validità), poi "Rifiuta"
 * (terziario di rischio) e "Accetta e gioca". Se il tuo Cielo non è valido, al posto di
 * "Accetta" c'è "Correggi il Cielo". Il mazzo e la Fazione dell'avversario restano nascosti fino
 * al Rotolo (D-014).
 *
 * Rispetto alla tavola mancano, finché il backend non le ha, le statistiche dell'avversario
 * ("12 vittorie · 7 sconfitte").
 */
export function ReceivedChallengeTile({
  challenge,
  deck,
  onDecline,
  declining,
  error,
}: ReceivedChallengeTileProps) {
  const { opponent } = challenge
  const invalid = deck?.valid === false
  return (
    <TilePanel glass as="article" aria-label={`${CHALLENGES_COPY.received}: ${opponent.nickname}`}>
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-stretch">
        <div className="flex flex-1 items-center gap-4">
          <PlayerAvatar player={opponent} size={64} />
          <div className="flex flex-col gap-1">
            <p className="type-eyebrow tracking-[0.1em] text-gold uppercase">
              {CHALLENGES_COPY.received}
            </p>
            <p className="type-h2 text-text">{opponent.nickname}</p>
            <p className="flex items-center gap-1.5 text-text-muted type-meta">
              <Icon name="scadenza" size={16} />
              {challengeTiming(challenge, 'ricevuta')}
            </p>
          </div>
        </div>
        <span aria-hidden="true" className="hidden w-px bg-gold/20 md:block" />
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="type-eyebrow tracking-[0.1em] text-gold uppercase">
            {CHALLENGES_COPY.playWith}
          </p>
          {deck ? (
            <div className="flex items-center gap-4">
              <CardFan cards={deck.cards.map(cardThumb)} cardWidth={34} step={12} />
              <div className="flex flex-col gap-0.5">
                <p className="type-h3 text-text">{deck.name}</p>
                <p className="type-meta">
                  <DeckValidity valid={deck.valid} />
                </p>
              </div>
            </div>
          ) : (
            <p className="type-h3 text-text">{CHALLENGES_COPY.yourSky}</p>
          )}
          <p className="text-text-muted type-meta">
            {CHALLENGES_COPY.hiddenDeck(opponent.nickname)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-stretch gap-3 border-t border-line-soft px-6 pt-4 pb-5 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
        {error && (
          <div className="sm:mr-auto">
            <FormAlert>{error}</FormAlert>
          </div>
        )}
        {invalid && !error && (
          <p className="flex items-center gap-1.5 font-extrabold text-warning type-meta sm:mr-auto">
            <Icon name="avviso" size={16} />
            {CHALLENGES_COPY.deckProblems(deck.problemCount)}
          </p>
        )}
        <TertiaryButton
          tone="risk"
          icon="chiudi"
          onClick={onDecline}
          disabled={declining}
          aria-label={`${CHALLENGES_COPY.decline} la sfida di ${opponent.nickname}`}
        >
          {CHALLENGES_COPY.decline}
        </TertiaryButton>
        {invalid ? (
          <GoldLink to={PATHS.deck} className="sm:w-58">
            {CHALLENGES_COPY.fixSky}
          </GoldLink>
        ) : (
          <GoldLink to={playChallengePath(challenge.id)} className="sm:w-58">
            {CHALLENGES_COPY.accept}
          </GoldLink>
        )}
      </div>
    </TilePanel>
  )
}
