import type { ReactNode } from 'react'
import { CardFan } from '@/components/game/CardFan'
import { DeckValidity } from '@/components/game/DeckValidity'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { PlayerAvatar } from '@/components/game/PlayerAvatar'
import type { Faction, PlayerRef } from '@/domain/game'
import { GOD_LABELS } from '@/domain/labels'
import { cardThumb } from '@/features/cards/thumb'
import { NEW_CHALLENGE_COPY } from '@/features/challenges/messages'
import type { MyDeckState } from '@/features/decks/queries'

/** Proprietà di {@link ChallengeSummary}. */
export interface ChallengeSummaryProps {
  opponent: PlayerRef | null
  /** La tua Fazione: entra nella sfida così com'è adesso (D-015). */
  faction: Faction | null
  /** Il Cielo con cui sfidi (`useMyDeck`). */
  sky: MyDeckState
}

/** Una riga del riepilogo: etichetta a sinistra, valore a destra. */
function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-t border-line-soft py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="shrink-0 type-eyebrow tracking-[0.1em] text-gold uppercase sm:w-24">
        {label}
      </dt>
      <dd className="min-w-0 text-text type-body">{children}</dd>
    </div>
  )
}

/** Il tuo Cielo nel riepilogo: nome e validità, sotto le sue carte in fila. */
function SkyValue({ sky }: { sky: MyDeckState }) {
  const { deck } = sky
  if (!deck) {
    return (
      <span className="flex flex-col gap-1">
        <span className="type-body-strong">{NEW_CHALLENGE_COPY.currentDeck}</span>
        {(sky.loading || sky.failed) && (
          <span className="text-text-muted type-meta">
            {sky.loading ? NEW_CHALLENGE_COPY.skyLoading : NEW_CHALLENGE_COPY.skyFailed}
          </span>
        )}
      </span>
    )
  }
  return (
    <span className="flex flex-col gap-2">
      <span className="flex flex-wrap items-center gap-3">
        <span className="type-body-strong">{deck.name}</span>
        <DeckValidity valid={deck.valid} />
      </span>
      <CardFan cards={deck.cards.map(cardThumb)} cardWidth={40} step={42} tilt={0} />
    </span>
  )
}

/**
 * Riepilogo della sfida prima di lanciarla (tavola Sfide-Nuova, colonna destra): avversario,
 * il tuo Cielo con le sue carte e la validità, la tua Fazione e quando si gioca.
 *
 * Rispetto alla tavola mancano, finché il backend non li ha: la scadenza (Q-11) e il premio
 * (dopo il SAL).
 */
export function ChallengeSummary({ opponent, faction, sky }: ChallengeSummaryProps) {
  return (
    <dl>
      <Line label={NEW_CHALLENGE_COPY.opponent}>
        {opponent ? (
          <span className="flex items-center gap-3">
            <PlayerAvatar player={opponent} size={40} />
            <span className="type-body-strong">{opponent.nickname}</span>
          </span>
        ) : (
          <span className="text-text-muted">{NEW_CHALLENGE_COPY.pickOpponent}</span>
        )}
      </Line>
      <Line label={NEW_CHALLENGE_COPY.yourSky}>
        <SkyValue sky={sky} />
      </Line>
      {faction && (
        <Line label={NEW_CHALLENGE_COPY.faction}>
          <span className="flex flex-wrap items-center gap-2">
            <ElementEmblem element={faction.element} size={24} />
            <span className="type-body-strong">{GOD_LABELS[faction.god].name}</span>
            <span className="text-text-muted">· {GOD_LABELS[faction.god].effect}</span>
          </span>
        </Line>
      )}
      <Line label={NEW_CHALLENGE_COPY.when}>
        {opponent ? NEW_CHALLENGE_COPY.whenText(opponent.nickname) : NEW_CHALLENGE_COPY.whenEmpty}
      </Line>
    </dl>
  )
}
