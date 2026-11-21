import type { ReactNode } from 'react'
import { GameCard } from '@/components/game/GameCard'
import { Icon } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import {
  ELEMENT_ABILITY,
  ELEMENT_LABELS,
  ELEMENT_WITH_ARTICLE,
  SIGN_IN,
  PLANET_LABELS,
  SIGN_LABELS,
  TIER_LABELS,
} from '@/domain/labels'
import { ELEMENT_BEATS } from '@/domain/rules'
import type { Element, SignCode } from '@/domain/game'
import { printedStats } from '@/features/cards/stats'
import { COLLECTION_COPY } from '@/features/collection/messages'
import type { CollectionEntry } from '@/features/collection/types'

const COPY = COLLECTION_COPY.detail

/** Colore della rarità nel sopratitolo (versione leggibile come testo, dai token). */
const TIER_TEXT = {
  COMMON: 'text-tier-comune-text',
  RARE: 'text-tier-rara-text',
  EPIC: 'text-tier-epica-text',
  LEGENDARY: 'text-tier-leggendaria-text',
  ASCENDANT: 'text-tier-ascendente-text',
} as const

/** Chi batte questo elemento: il ciclo letto al contrario. */
const beatenBy = (element: Element): Element =>
  (Object.keys(ELEMENT_BEATS) as Element[]).find((e) => ELEMENT_BEATS[e] === element) ?? element

/** "di Fuoco", "d'Acqua". */
/** "nel Leone" → "del Leone", "nell'Ariete" → "dell'Ariete". */
const ofSign = (sign: SignCode) => `d${SIGN_IN[sign].slice(1)}`
const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`)

/** Una statistica grande con la sua scomposizione ("17 · Attacco · 8 Toro + 9 Sole"). */
function Stat({ kind, value, parts }: { kind: 'atk' | 'def'; value: string; parts: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-flex h-12 min-w-20 items-center justify-center gap-1.5 rounded-pill px-4 font-display text-[1.375rem] font-black text-text tabular-nums ${
          kind === 'atk' ? 'bg-atk-card' : 'bg-def-card'
        }`}
      >
        <Icon name={kind} size={16} />
        {value}
      </span>
      <span className="flex flex-col">
        <span className="type-eyebrow tracking-[0.12em] text-text-muted uppercase">
          {kind === 'atk' ? COPY.attack : COPY.defense}
        </span>
        <span className="text-text type-meta">{parts}</span>
      </span>
    </div>
  )
}

/** Un riquadro d'identità (pianeta, segno, casa). */
function Block({ title, name, children }: { title: string; name: string; children: ReactNode }) {
  return (
    <div className="rounded-md flex flex-col gap-1 bg-bg-deep/50 p-4 shadow-[inset_0_0_0_1px_rgba(243,235,221,0.08)]">
      <span className="type-eyebrow tracking-[0.12em] text-gold uppercase">{title}</span>
      <span className="text-text type-body-strong">{name}</span>
      <span className="text-text-muted type-meta">{children}</span>
    </div>
  )
}

/** Proprietà di {@link CardDetail}. */
export interface CardDetailProps {
  entry: CollectionEntry
  /** Posizione nella lista da cui si è arrivati e quante sono. */
  index: number
  total: number
  onPrevious: () => void
  onNext: () => void
}

/**
 * Dettaglio di una carta (X01, tavola Collezione-Dettaglio): la carta grande con precedente e
 * successiva nell'ordine della lista, le statistiche spiegate (il giocatore non deve fare conti),
 * pianeta, segno con il ciclo degli elementi e casa (o l'effetto dell'Ascendente), e quante ne ha.
 * Le azioni della tavola (Usa nel Cielo, Proponi in scambio, Ricicla) arrivano con le loro pagine.
 */
export function CardDetail({ entry, index, total, onPrevious, onNext }: CardDetailProps) {
  const { card, owned, number } = entry
  const element = card.element
  const planet = card.planetStats
  const signName = SIGN_LABELS[card.sign]
  const planetName = card.planet ? PLANET_LABELS[card.planet] : null

  // Statistiche spiegate come sulla carta stampata (i bonus in campo li applica l'engine).
  const stats = printedStats(card)

  return (
    <div className="grid gap-8 px-5 py-8 md:grid-cols-[minmax(0,17rem)_1fr] md:items-start md:px-12 md:py-10">
      <div className="flex flex-col items-center gap-4">
        <GameCard
          size="fluid"
          imageUrl={card.imageUrl}
          label={card.name}
          missing={!owned}
          missingLabel={number}
          aura={card.tier}
          isNew={owned?.isNew ?? false}
          copies={owned?.quantity ?? 1}
          className="max-w-[17rem]"
        />
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onPrevious}
            disabled={index <= 0}
            aria-label={COPY.previous}
            className="cursor-pointer rounded-full border-0 bg-transparent p-0 disabled:cursor-default disabled:opacity-40"
          >
            <Medallion size={36}>
              <Icon name="indietro" size={16} className="text-gold-bright" />
            </Medallion>
          </button>
          <span className="text-text tabular-nums type-meta-strong">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={index >= total - 1}
            aria-label={COPY.next}
            className="cursor-pointer rounded-full border-0 bg-transparent p-0 disabled:cursor-default disabled:opacity-40"
          >
            <Medallion size={36}>
              <Icon name="avanti" size={16} className="text-gold-bright" />
            </Medallion>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 pr-12">
          <p
            className={`flex items-center gap-2 type-eyebrow tracking-[0.12em] uppercase ${TIER_TEXT[card.tier]}`}
          >
            <span aria-hidden="true" className="size-2 rotate-45 bg-current" />
            {TIER_LABELS[card.tier]}
            {card.house && ` · Casa ${card.house}`}
            <span className="text-text-muted">· {number}</span>
          </p>
          <h2 className="text-text type-h1-m xl:type-h1">{card.name}</h2>
        </div>

        {card.type === 'CREATURE' && (
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Stat kind="atk" value={stats.atk.value} parts={stats.atk.parts} />
            <Stat kind="def" value={stats.def.value} parts={stats.def.parts} />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {planet && planetName && (
            <Block title={COPY.planet} name={planetName}>
              {TIER_LABELS[card.tier]}: {signed(planet.atk)} ATK, {signed(planet.def)} DEF
            </Block>
          )}
          <Block title={COPY.sign} name={`${signName} · ${ELEMENT_LABELS[element]}`}>
            Batte {ELEMENT_WITH_ARTICLE[ELEMENT_BEATS[element]]}, perde contro{' '}
            {ELEMENT_WITH_ARTICLE[beatenBy(element)]}. {ELEMENT_ABILITY[element]}
          </Block>
          {card.type === 'CREATURE' && card.house && (
            <Block title={COPY.house} name={`Casa ${card.house}`}>
              +2 DEF quando entra in campo.
            </Block>
          )}
          {card.type === 'ASCENDANT' && (
            <Block title={COPY.ascendant} name={signName}>
              {/* Come l'engine (AscendantAbility): solo le carte dello stesso segno */}
              +1 ATK quando attaccano le carte {ofSign(card.sign)} del tuo Cielo.
            </Block>
          )}
        </div>

        <p className="flex flex-wrap items-center gap-x-2 border-t border-line-thin pt-4 text-text-soft type-meta">
          <Icon name="collezione" size={16} className="text-gold" />
          <span>{owned ? COPY.owned(owned.quantity) : COPY.missing}</span>
          {owned?.inDeck && <span>{COPY.inDeck}</span>}
          {owned?.isNew && <span>{COPY.isNew}</span>}
        </p>
      </div>
    </div>
  )
}
