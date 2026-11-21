import { useMemo, useState, type ReactNode } from 'react'
import { PATHS } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { Dialog } from '@/components/overlay/Dialog'
import { GoldLink } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { SIGN_GLYPHS, SIGN_LABELS, TIER_LABELS } from '@/domain/labels'
import {
  NO_FILTERS,
  SIGN_ORDER,
  albumGroups,
  applyFilters,
  filterChips,
  isFiltered,
  type CollectionFilters,
} from '@/features/collection/album'
import { CardDetail } from '@/features/collection/components/CardDetail'
import { CollectionHeader } from '@/features/collection/components/CollectionHeader'
import { CollectionProgress } from '@/features/collection/components/CollectionProgress'
import { CollectionTile } from '@/features/collection/components/CollectionTile'
import { CollectionToolbar } from '@/features/collection/components/CollectionToolbar'
import { COLLECTION_COPY } from '@/features/collection/messages'
import { useCollectionEntries } from '@/features/collection/queries'
import type { CollectionEntry } from '@/features/collection/types'

const COPY = COLLECTION_COPY

/** Colonne della griglia: 12 su desktop (un pianeta per riga, come la tavola), meno sui piccoli. */
const GRID =
  'grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-12 xl:gap-x-4'

/** Stato vuoto o senza risultati (tavola Collezione-Vuota): il ventaglio di dorsi vuoti, titolo e azione. */
function EmptyState({ title, text, action }: { title: string; text: string; action: ReactNode }) {
  return (
    <section className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <span aria-hidden="true" className="relative mb-2 h-28 w-40">
        {[-12, 0, 12].map((r) => (
          <span
            key={r}
            className="rounded-md absolute top-0 left-1/2 h-28 w-20 border border-dashed border-gold-bright/30 bg-bg-deep/70"
            style={{ transform: `translateX(-50%) rotate(${r}deg)` }}
          />
        ))}
      </span>
      <h2 className="type-h2 tracking-[0.08em] text-text uppercase">{title}</h2>
      <p className="max-w-[28.75rem] text-text-muted type-body">{text}</p>
      <div className="mt-2">{action}</div>
    </section>
  )
}

/**
 * Collezione · Carte (S05, tavole Collezione, Collezione-Filtrata, Collezione-Vuota,
 * Collezione-Dettaglio): l'avanzamento, i filtri e l'album di tutte le carte del catalogo, con le
 * mancanti come sagome numerate. Con un filtro attivo l'album diventa una griglia con i nomi e i
 * filtri come chip. Toccando una carta si apre il dettaglio, con precedente e successiva.
 *
 * Nasce dal lavoro di Luca (filtri per elemento e categoria, stati vuoti, dettaglio), rifatto sulla
 * struttura attuale: catalogo, Carta e `/api/collection`. Non ancora: ordinamento, raggruppamento
 * per elemento, riciclo dei doppioni e "Nuova" che si spegne (servono endpoint del backend).
 */
export function CollectionPage() {
  const { entries, collection } = useCollectionEntries()
  const [filters, setFilters] = useState<CollectionFilters>(NO_FILTERS)
  const [openId, setOpenId] = useState<number | null>(null)

  const filtered = useMemo(() => applyFilters(entries, filters), [entries, filters])
  const filteredView = isFiltered(filters)
  const groups = useMemo(() => albumGroups(filtered), [filtered])
  const chips = filterChips(filters)
  const ownedCount = filtered.filter((e) => e.owned).length
  const nothingOwned = collection.owned.size === 0

  // Il dettaglio scorre nell'ordine della lista da cui si è arrivati.
  const openIndex = openId === null ? -1 : filtered.findIndex((e) => e.card.id === openId)
  const openEntry: CollectionEntry | undefined = filtered[openIndex]

  const tile = (entry: CollectionEntry) => (
    <CollectionTile
      key={entry.card.id}
      entry={entry}
      withName={filteredView}
      onOpen={() => setOpenId(entry.card.id)}
    />
  )

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 pt-(--shell-top) pb-(--shell-bottom) xl:px-8">
      <title>{`${COPY.title} · Zodiax Arena`}</title>
      <PorticoBackdrop />

      <CollectionHeader aside={<CollectionProgress progress={collection.progress} />} />

      <div className="mt-6">
        <CollectionToolbar
          filters={filters}
          onChange={setFilters}
          duplicates={collection.duplicates.copies}
        />
      </div>

      {filteredView && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-text-muted type-meta" aria-live="polite">
            {COPY.count(filtered.length, ownedCount)}
          </p>
          <ul className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip.key}>
                <button
                  type="button"
                  onClick={() => setFilters(chip.without)}
                  aria-label={COPY.filters.remove(chip.label)}
                  className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-pill border-0 bg-surface-2 px-3 text-text shadow-[inset_0_0_0_1px_var(--za-gold)] type-meta-strong"
                >
                  {chip.label}
                  <Icon name="chiudi" size={14} className="text-text-muted" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setFilters(NO_FILTERS)}
            className="cursor-pointer border-0 bg-transparent p-0 text-gold-bright type-meta-strong"
          >
            {COPY.filters.reset}
          </button>
        </div>
      )}

      {/* Su desktop i segni sono le colonne dell'album e il filtro per segno: un tocco mostra solo
          quel segno, un altro lo toglie. Su mobile il segno sta in "Altri filtri". */}
      {!(nothingOwned && !filteredView) && (
        <fieldset className={`m-0 mt-6 hidden border-0 p-0 ${GRID} xl:grid`}>
          <legend className="sr-only">{COPY.filters.sign}</legend>
          {SIGN_ORDER.map((sign) => {
            const pressed = filters.sign === sign
            return (
              <button
                key={sign}
                type="button"
                aria-pressed={pressed}
                onClick={() => setFilters({ ...filters, sign: pressed ? null : sign })}
                className={`rounded-md flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent px-1 pt-2 pb-1 type-eyebrow tracking-[0.1em] uppercase transition-[color,opacity] ${
                  pressed
                    ? 'text-(--za-clasp-light)'
                    : `text-gold-bright hover:text-(--za-clasp-light) ${filters.sign ? 'opacity-50 hover:opacity-100' : ''}`
                }`}
              >
                <span aria-hidden="true" className="text-[1rem]">
                  {SIGN_GLYPHS[sign]}
                </span>
                {SIGN_LABELS[sign]}
                <span
                  aria-hidden="true"
                  className={`mt-1 h-px w-10 ${pressed ? 'bg-(image:--za-edge-gold-h) shadow-[0_0_8px_rgba(255,214,107,0.7)]' : 'bg-transparent'}`}
                />
              </button>
            )
          })}
        </fieldset>
      )}

      <div className="mt-4 pb-10">
        {nothingOwned && !filteredView ? (
          <EmptyState
            title={COPY.empty.title}
            text={COPY.empty.text}
            action={
              <GoldLink hero size="l" to={PATHS.shop} className="w-64">
                Negozio
              </GoldLink>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={COPY.noResults.title}
            text={COPY.noResults.text}
            action={
              <SecondaryButton onClick={() => setFilters(NO_FILTERS)} className="w-60">
                {COPY.noResults.action}
              </SecondaryButton>
            }
          />
        ) : filteredView ? (
          <ul aria-label={COPY.albumLabel} className={GRID}>
            {filtered.map(tile)}
          </ul>
        ) : (
          <div aria-label={COPY.albumLabel} className="flex flex-col gap-8">
            {groups.map((group) => (
              <section
                key={group.key}
                aria-labelledby={`gruppo-${group.key}`}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <h2
                    id={`gruppo-${group.key}`}
                    className="flex items-center gap-3 font-display text-[1.0625rem] font-bold tracking-[0.08em] text-text uppercase"
                  >
                    {group.title}
                    <span className="flex items-center gap-1.5 type-eyebrow tracking-[0.12em] text-gold">
                      <span aria-hidden="true" className="size-1.5 rotate-45 bg-current" />
                      {TIER_LABELS[group.tier]}
                    </span>
                  </h2>
                  <span aria-hidden="true" className="h-px flex-1 bg-line-soft" />
                  <span className="text-text tabular-nums type-meta-strong">
                    {COPY.groupCount(group.owned, group.entries.length)}
                  </span>
                </div>
                <ul className={GRID}>{group.entries.map(tile)}</ul>
              </section>
            ))}
          </div>
        )}
      </div>

      {openEntry && (
        <Dialog label={openEntry.card.name} onClose={() => setOpenId(null)}>
          <CardDetail
            entry={openEntry}
            index={openIndex}
            total={filtered.length}
            onPrevious={() => setOpenId(filtered[openIndex - 1]?.card.id ?? openId)}
            onNext={() => setOpenId(filtered[openIndex + 1]?.card.id ?? openId)}
          />
        </Dialog>
      )}
    </main>
  )
}
