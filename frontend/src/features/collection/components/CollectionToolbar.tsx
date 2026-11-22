import { useEffect, useRef, useState } from 'react'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { TertiaryButton } from '@/components/ui/TertiaryButton'
import type { Element, SignCode, Tier } from '@/domain/game'
import { ELEMENT_LABELS, SIGN_GLYPHS, SIGN_LABELS, TIER_LABELS } from '@/domain/labels'
import {
  ELEMENT_ORDER,
  SIGN_ORDER,
  STATE_LABELS,
  TIER_ORDER,
  type CollectionFilters,
  type EntryState,
} from '@/features/collection/album'
import { COLLECTION_COPY } from '@/features/collection/messages'

const COPY = COLLECTION_COPY.filters

/** Colore del rombo di ogni rarità (token dei tier delle carte). */
const TIER_COLOR: Record<Tier, string> = {
  COMMON: 'var(--za-tier-comune)',
  RARE: 'var(--za-tier-rara)',
  EPIC: 'var(--za-tier-epica)',
  LEGENDARY: 'var(--za-tier-leggendaria)',
  ASCENDANT: 'var(--za-tier-ascendente)',
}

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value]

/** Proprietà di {@link CollectionToolbar}. */
export interface CollectionToolbarProps {
  filters: CollectionFilters
  onChange: (filters: CollectionFilters) => void
  /** Copie in più (doppioni) da mostrare a destra; 0 per nasconderle. */
  duplicates: number
}

/**
 * Barra dei filtri della Collezione (tavola Collezione): elemento (i quattro stemmi), rarità (i
 * rombi del colore del tier), "Altri filtri" (segno e stato), "Solo possedute" e i doppioni.
 * Ogni filtro è un pulsante vero con il suo stato (`aria-pressed`, `role="switch"`).
 */
export function CollectionToolbar({ filters, onChange, duplicates }: CollectionToolbarProps) {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreCount = (filters.sign ? 1 : 0) + (filters.state !== 'ALL' ? 1 : 0)

  // "Altri filtri" si chiude con Esc o toccando fuori.
  useEffect(() => {
    if (!moreOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false)
    const onDown = (e: PointerEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [moreOpen])

  const setElement = (el: Element) =>
    onChange({ ...filters, elements: toggle(filters.elements, el) })
  const setTier = (t: Tier) => onChange({ ...filters, tiers: toggle(filters.tiers, t) })
  const setSign = (s: SignCode | null) => onChange({ ...filters, sign: s })
  const setState = (s: EntryState) => onChange({ ...filters, state: s })

  return (
    <fieldset className="m-0 flex min-w-0 flex-wrap items-center gap-x-6 gap-y-4 border-0 p-0">
      <legend className="sr-only">{COPY.label}</legend>
      <div className="flex items-center gap-3">
        <span className="type-eyebrow tracking-[0.12em] text-text-muted uppercase">
          {COPY.element}
        </span>
        {ELEMENT_ORDER.map((el) => {
          const pressed = filters.elements.includes(el)
          return (
            <button
              key={el}
              type="button"
              aria-pressed={pressed}
              aria-label={ELEMENT_LABELS[el]}
              onClick={() => setElement(el)}
              className={`flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 transition-shadow ${
                pressed
                  ? 'shadow-[0_0_0_2px_var(--za-clasp-light),0_0_12px_rgba(255,214,107,0.5)]'
                  : ''
              }`}
            >
              <ElementEmblem element={el} size={38} />
            </button>
          )
        })}
      </div>

      <span aria-hidden="true" className="hidden h-8 w-px bg-line-soft md:block" />

      <div className="flex items-center gap-3">
        <span className="type-eyebrow tracking-[0.12em] text-text-muted uppercase">
          {COPY.tier}
        </span>
        {TIER_ORDER.map((t) => {
          const pressed = filters.tiers.includes(t)
          return (
            <button
              key={t}
              type="button"
              aria-pressed={pressed}
              aria-label={TIER_LABELS[t]}
              title={TIER_LABELS[t]}
              onClick={() => setTier(t)}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0"
            >
              <span
                aria-hidden="true"
                className="size-3.5 rotate-45 border-[1.5px]"
                style={{
                  borderColor: TIER_COLOR[t],
                  background: pressed ? TIER_COLOR[t] : 'transparent',
                  boxShadow: pressed ? `0 0 10px ${TIER_COLOR[t]}` : 'none',
                }}
              />
            </button>
          )
        })}
      </div>

      <span aria-hidden="true" className="hidden h-8 w-px bg-line-soft md:block" />

      <div ref={moreRef} className="relative">
        <TertiaryButton
          icon="filtri"
          aria-expanded={moreOpen}
          aria-controls="collezione-altri-filtri"
          onClick={() => setMoreOpen((o) => !o)}
        >
          {COPY.more}
          {/* Su desktop il segno ha la sua riga: qui conta solo lo stato */}
          {moreCount > 0 && (
            <span className="ml-1 text-gold-bright tabular-nums xl:hidden">{moreCount}</span>
          )}
          {filters.state !== 'ALL' && (
            <span className="ml-1 hidden text-gold-bright tabular-nums xl:inline">1</span>
          )}
        </TertiaryButton>
        {moreOpen && (
          <TilePanel
            as="div"
            aria-label={COPY.more}
            className="absolute top-full left-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))]"
          >
            <div id="collezione-altri-filtri" className="flex flex-col gap-4 p-4">
              <fieldset className="flex flex-col gap-2 xl:hidden">
                <legend className="mb-2 type-eyebrow tracking-[0.12em] text-text-muted uppercase">
                  {COPY.sign}
                </legend>
                <div className="grid grid-cols-6 gap-1.5">
                  {SIGN_ORDER.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={filters.sign === s}
                      aria-label={SIGN_LABELS[s]}
                      title={SIGN_LABELS[s]}
                      onClick={() => setSign(filters.sign === s ? null : s)}
                      className={`rounded-md flex h-9 cursor-pointer items-center justify-center border-0 text-[1.125rem] ${
                        filters.sign === s
                          ? 'bg-gold-bright/15 text-gold-bright shadow-[inset_0_0_0_1px_var(--za-gold)]'
                          : 'bg-surface-2/60 text-text-soft'
                      }`}
                    >
                      {SIGN_GLYPHS[s]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 type-eyebrow tracking-[0.12em] text-text-muted uppercase">
                  {COPY.state}
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(STATE_LABELS) as EntryState[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={filters.state === s}
                      onClick={() => setState(s)}
                      className={`h-8 cursor-pointer rounded-pill border-0 px-3 type-meta-strong ${
                        filters.state === s
                          ? 'bg-gold-bright/15 text-gold-bright shadow-[inset_0_0_0_1px_var(--za-gold)]'
                          : 'bg-surface-2/60 text-text-soft'
                      }`}
                    >
                      {STATE_LABELS[s]}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </TilePanel>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 xl:ml-auto">
        <button
          type="button"
          role="switch"
          aria-checked={filters.onlyOwned}
          onClick={() => onChange({ ...filters, onlyOwned: !filters.onlyOwned })}
          className="flex cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-text type-meta-strong"
        >
          <span
            aria-hidden="true"
            className={`relative h-6 w-10 rounded-full transition-colors ${
              filters.onlyOwned ? 'bg-gold/80' : 'bg-surface-3'
            } shadow-[inset_0_0_0_1px_rgba(243,235,221,0.2)]`}
          >
            <span
              className={`absolute top-1 size-4 rounded-full bg-text-soft transition-[left] ${
                filters.onlyOwned ? 'left-5' : 'left-1'
              }`}
            />
          </span>
          {COPY.onlyOwned}
        </button>
        {duplicates > 0 && (
          <span className="flex items-center gap-2 text-text-soft type-meta-strong">
            <Icon name="doppione" size={16} className="text-gold-bright" />
            {COLLECTION_COPY.duplicates(duplicates)}
          </span>
        )}
      </div>
    </fieldset>
  )
}
