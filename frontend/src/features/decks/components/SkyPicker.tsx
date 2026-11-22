import { useMemo, useState, type ReactNode } from 'react'
import { PATHS } from '@/app/paths'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { GameCard } from '@/components/game/GameCard'
import { TilePanel } from '@/components/panels/TilePanel'
import { GoldLink } from '@/components/ui/GoldButton'
import { SelectField } from '@/components/ui/SelectField'
import type { Element, PlanetCode } from '@/domain/game'
import { ELEMENT_LABELS, PLANET_LABELS, SIGN_GLYPHS } from '@/domain/labels'
import type { CardDefinition } from '@/features/cards/types'
import type { OwnedCard } from '@/features/collection/types'
import { StatPills } from '@/features/decks/components/StatPills'
import { SKY_COPY } from '@/features/decks/messages'
import { ELEMENT_RANGE, SKY_ELEMENTS, elementCounts, type SkySlots } from '@/features/decks/sky'
import type { DeckSlot } from '@/features/decks/types'
import type { Catalog } from '@/features/cards/queries'

const COPY = SKY_COPY.picker

type SortKey = 'catalog' | 'atk' | 'def'

/** Proprietà di {@link SkyPicker}. */
export interface SkyPickerProps {
  slot: DeckSlot | null
  slots: SkySlots
  catalog: Catalog
  owned: ReadonlyMap<number, OwnedCard>
  /** Filtro d'elemento iniziale (quando lo apre un avviso "Nessuna carta d'Acqua"). */
  initialElement?: Element | null
  onPick: (cardId: number) => void
  /**
   * Dentro la finestra (telefono e tablet, ux/deck.md: il selettore si apre sopra la pagina): niente
   * cornice propria, la finestra è già una Tessera, e la lista usa l'altezza della finestra.
   */
  inSheet?: boolean
}

/**
 * Selettore di carta per una casella (S07, tavola Collezione-Cielo, colonna destra): solo le carte
 * di quel pianeta (o gli Ascendenti), possedute per prime; con "Mostra anche quelle che non hai"
 * le mancanti si vedono ma non si scelgono. Per ogni carta ATK e DEF stampati e, se la scelta
 * sbilancia gli elementi, la conseguenza ("Con questa carta: Fuoco 4/3"). La scelta resta libera.
 */
export function SkyPicker({
  slot,
  slots,
  catalog,
  owned,
  initialElement = null,
  onPick,
  inSheet = false,
}: SkyPickerProps) {
  const [element, setElement] = useState<Element | 'ALL'>(initialElement ?? 'ALL')
  const [sort, setSort] = useState<SortKey>('catalog')
  const [showMissing, setShowMissing] = useState(false)

  const isAscendant = slot === 'ASCENDANT'
  const slotName =
    slot === null ? '' : isAscendant ? "l'Ascendente" : PLANET_LABELS[slot as PlanetCode]
  // "Scegli il Sole", "Scegli la Luna" (tavola); gli altri pianeti senza articolo.
  const title = slot === 'SOLE' ? 'il Sole' : slot === 'LUNA' ? 'la Luna' : slotName

  const options = useMemo(() => {
    if (slot === null) return []
    const ofSlot = catalog.cards.filter((c) =>
      isAscendant ? c.type === 'ASCENDANT' : c.planet === slot,
    )
    const score = (c: CardDefinition) =>
      sort === 'atk'
        ? c.signStats.atk + (c.planetStats?.atk ?? 0)
        : c.signStats.def + (c.planetStats?.def ?? 0)
    return ofSlot
      .filter((c) => element === 'ALL' || c.element === element)
      .filter((c) => showMissing || owned.has(c.id))
      .sort((a, b) => {
        const own = Number(owned.has(b.id)) - Number(owned.has(a.id))
        if (own !== 0) return own
        return sort === 'catalog' ? a.id - b.id : score(b) - score(a)
      })
  }, [slot, isAscendant, catalog, element, sort, showMissing, owned])

  if (slot === null) {
    return (
      <TilePanel as="div" className={inSheet ? '' : 'h-full'}>
        <p className="px-5 py-6 text-text-muted type-meta">{COPY.hint}</p>
      </TilePanel>
    )
  }

  const ownsAny = catalog.cards.some(
    (c) => owned.has(c.id) && (isAscendant ? c.type === 'ASCENDANT' : c.planet === slot),
  )
  const before = elementCounts(slots, catalog)

  /** Come cambia l'equilibrio con questa carta: solo gli elementi che finiscono fuori da 1–3. */
  const consequence = (card: CardDefinition) => {
    if (isAscendant) return null
    const after = elementCounts({ ...slots, [slot]: card.id }, catalog)
    const off = SKY_ELEMENTS.filter(
      (el) =>
        after[el] !== before[el] &&
        (after[el] > ELEMENT_RANGE.max || after[el] < ELEMENT_RANGE.min),
    )
    if (off.length === 0) return null
    return COPY.consequence(
      off
        .map(
          (el) =>
            `${ELEMENT_LABELS[el]} ${after[el]}/${after[el] > ELEMENT_RANGE.max ? ELEMENT_RANGE.max : ELEMENT_RANGE.min}`,
        )
        .join(' · '),
    )
  }

  /** Per un Ascendente: le carte del Cielo con il suo segno (come l'engine). */
  const ascendantTargets = (card: CardDefinition) =>
    (Object.entries(slots) as [DeckSlot, number | null][])
      .filter(([s, id]) => s !== 'ASCENDANT' && id !== null)
      .map(([, id]) => catalog.byId.get(id as number))
      .filter((c): c is CardDefinition => !!c && c.sign === card.sign)
      .map((c) => c.name)

  return (
    <PickerFrame inSheet={inSheet} label={COPY.title(title)}>
      <div className={`flex flex-col gap-4 ${inSheet ? 'px-5 pt-8 pb-6 md:px-8' : 'h-full p-5'}`}>
        <h2 className="flex items-center gap-2 pr-12 type-panel-title tracking-[0.1em] text-text uppercase">
          <span aria-hidden="true" className="text-gold-bright">
            ✦
          </span>
          {COPY.title(title)}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {!isAscendant && (
            <SelectField
              label={COPY.element}
              placeholder={COPY.element}
              value={element}
              onChange={(e) => setElement(e.target.value as Element | 'ALL')}
              options={[
                { value: 'ALL', label: COPY.allElements },
                ...SKY_ELEMENTS.map((el) => ({ value: el, label: ELEMENT_LABELS[el] })),
              ]}
              variant="filter"
            />
          )}
          <SelectField
            label={COPY.sort}
            placeholder={COPY.sort}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            options={[
              { value: 'catalog', label: COPY.sortCatalog },
              { value: 'atk', label: COPY.sortAtk },
              { value: 'def', label: COPY.sortDef },
            ]}
            variant="filter"
          />
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={showMissing}
          onClick={() => setShowMissing((v) => !v)}
          className="flex cursor-pointer items-center gap-3 self-start border-0 bg-transparent p-0 text-text type-meta-strong"
        >
          <span
            aria-hidden="true"
            className={`relative h-6 w-10 rounded-full shadow-[inset_0_0_0_1px_rgba(243,235,221,0.2)] transition-colors ${
              showMissing ? 'bg-gold/80' : 'bg-surface-3'
            }`}
          >
            <span
              className={`absolute top-1 size-4 rounded-full bg-text-soft transition-[left] ${
                showMissing ? 'left-5' : 'left-1'
              }`}
            />
          </span>
          {COPY.showMissing}
        </button>

        {!ownsAny && !showMissing ? (
          <div className="flex flex-col items-start gap-3 py-2">
            <p className="text-text type-meta">
              <b>{isAscendant ? COPY.noAscendant : COPY.empty(slotName)}</b> {COPY.emptyHint}
            </p>
            <GoldLink to={PATHS.shop} className="w-56">
              {COPY.toShop}
            </GoldLink>
          </div>
        ) : (
          // Scorre solo la lista: titolo, filtri e interruttore restano fermi. Su desktop la lista
          // prende lo spazio fino al fondo del pannello (alto quanto la colonna di sinistra),
          // nella finestra resta entro l'altezza dello schermo.
          <ul
            aria-label={COPY.title(title)}
            className={`-mr-3 flex flex-col divide-y divide-line-thin overflow-y-auto overscroll-contain pr-3 ${
              inSheet ? 'max-h-[max(14rem,calc(100dvh-15rem))]' : 'min-h-0 flex-1'
            }`}
          >
            {options.map((card) => {
              const mine = owned.has(card.id)
              const inSky = slots[slot] === card.id
              const note = consequence(card)
              return (
                <li key={card.id}>
                  <button
                    type="button"
                    disabled={!mine}
                    aria-pressed={inSky}
                    onClick={() => onPick(card.id)}
                    className={`flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent px-1 py-3 text-left disabled:cursor-default ${
                      inSky ? 'bg-gold-bright/5' : ''
                    } ${mine ? '' : 'opacity-50'}`}
                  >
                    <GameCard
                      size="xs"
                      imageUrl={card.imageUrl}
                      label={card.name}
                      missing={!mine}
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="flex items-center gap-2 text-text type-body-strong">
                        {card.name}
                        <span aria-hidden="true" className="text-gold-bright">
                          {SIGN_GLYPHS[card.sign]}
                        </span>
                        <span aria-hidden="true">
                          <ElementEmblem element={card.element} size={16} />
                        </span>
                        {inSky && (
                          <span className="ml-auto rounded-pill px-2 py-0.5 tracking-[0.06em] text-gold-bright uppercase type-badge inset-ring inset-ring-gold">
                            {COPY.inSky}
                          </span>
                        )}
                      </span>
                      {!mine ? (
                        <span className="text-text-muted type-meta">{COPY.missing}</span>
                      ) : isAscendant ? (
                        <span className="text-text-muted type-meta">
                          {SKY_COPY.slot.ascendantTargets(ascendantTargets(card))}
                        </span>
                      ) : (
                        <span className="flex flex-wrap items-center gap-2 text-text-muted type-meta">
                          {COPY.printed} <StatPills card={card} />
                        </span>
                      )}
                      {mine && note && (
                        <span className="flex items-center gap-1.5 text-warning type-meta-strong">
                          <span
                            aria-hidden="true"
                            className="size-2 rotate-45 border border-warning"
                          />
                          {note}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
        {isAscendant && (
          // L'effetto come lo applica l'engine (AscendantAbility): solo le carte dello stesso segno.
          <p className="text-text-muted type-caption">{COPY.ascendantRule}</p>
        )}
      </div>
    </PickerFrame>
  )
}

/** La cornice del selettore: la Tessera nella colonna di destra, niente dentro la finestra. */
function PickerFrame({
  inSheet,
  label,
  children,
}: {
  inSheet: boolean
  label: string
  children: ReactNode
}) {
  if (inSheet) return <div aria-label={label}>{children}</div>
  return (
    <TilePanel as="div" aria-label={label} className="h-full">
      {children}
    </TilePanel>
  )
}
