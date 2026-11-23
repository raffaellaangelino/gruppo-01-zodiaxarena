import { useState } from 'react'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { Dialog } from '@/components/overlay/Dialog'
import { MEDIA } from '@/config/breakpoints'
import { GoldButton } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { InlineError } from '@/components/ui/InlineError'
import { SelectField } from '@/components/ui/SelectField'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import type { Element, Faction, PlanetCode } from '@/domain/game'
import { PLANET_LABELS } from '@/domain/labels'
import { useCatalog } from '@/features/cards/queries'
import { CollectionHeader } from '@/features/collection/components/CollectionHeader'
import { useCollection } from '@/features/collection/queries'
import { ElementBalance } from '@/features/decks/components/ElementBalance'
import { FactionBand } from '@/features/decks/components/FactionBand'
import { SkyPicker } from '@/features/decks/components/SkyPicker'
import { SkySlotTile } from '@/features/decks/components/SkySlotTile'
import { SkyWarnings } from '@/features/decks/components/SkyWarnings'
import { SKY_COPY } from '@/features/decks/messages'
import { useCreateDeck, useDeckList, useDeckToEdit, useSaveDeck } from '@/features/decks/queries'
import {
  SKY_LAYOUT,
  elementCounts,
  sameSlots,
  skyWarnings,
  slotCards,
  type SkySlots,
  type SkyWarning,
} from '@/features/decks/sky'
import type { DeckSlot } from '@/features/decks/types'
import { usePlayerSummary } from '@/features/player/queries'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ApiError } from '@/lib/http'

const COPY = SKY_COPY
const EMPTY_SKY_SLOTS: SkySlots = {
  SOLE: null,
  LUNA: null,
  MARTE: null,
  GIOVE: null,
  SATURNO: null,
  MERCURIO: null,
  VENERE: null,
  ASCENDANT: null,
}

/**
 * Collezione · Il tuo Cielo: elenca i mazzi del giocatore e consente di crearne fino al limite
 * comunicato dal backend. Un nuovo Cielo parte come bozza vuota.
 */
export function SkyPage() {
  const { faction } = usePlayerSummary()
  const decks = useDeckList()
  const createDeck = useCreateDeck()
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null)
  const deckId = selectedDeckId ?? decks.items[0]?.id ?? null
  const createError =
    createDeck.error instanceof ApiError && createDeck.error.code === 'DECK_LIMIT_REACHED'
      ? COPY.deckLimitReached(decks.max)
      : createDeck.error
        ? COPY.createDeckFailed
        : null

  const createNewDeck = () => {
    if (decks.items.length >= decks.max || createDeck.isPending) return
    createDeck.reset()
    createDeck.mutate(
      {
        name: `${COPY.newDeckName} ${decks.items.length + 1}`,
        slots: EMPTY_SKY_SLOTS,
      },
      { onSuccess: (created) => setSelectedDeckId(created.id) },
    )
  }

  return (
    <main className="mx-auto w-full max-w-[90rem] px-4 pt-(--shell-top) pb-(--shell-bottom) xl:px-8">
      <title>{`${COPY.title} · Zodiax Arena`}</title>
      <PorticoBackdrop />
      <CollectionHeader />
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          {decks.items.length > 0 && (
            <SelectField
              label={COPY.deckChoiceLabel}
              placeholder={COPY.deckChoicePlaceholder}
              value={deckId?.toString() ?? ''}
              options={decks.items.map((deck) => ({ value: deck.id.toString(), label: deck.name }))}
              onChange={(event) => {
                createDeck.reset()
                setSelectedDeckId(Number(event.target.value))
              }}
              className="w-full max-w-sm min-w-56"
            />
          )}
          <span className="pb-3 text-text-muted type-meta">
            {COPY.deckCount(decks.items.length, decks.max)}
          </span>
        </div>
        <GoldButton
          onClick={createNewDeck}
          disabled={decks.items.length >= decks.max || createDeck.isPending}
          busy={createDeck.isPending}
        >
          {createDeck.isPending ? COPY.creatingDeck : COPY.createDeck}
        </GoldButton>
      </div>
      {decks.items.length >= decks.max && (
        <p className="mt-3 text-text-muted type-meta">{COPY.deckLimitHint}</p>
      )}
      {createError && (
        <p className="mt-3 text-warning type-meta-strong" role="alert">
          {createError}
        </p>
      )}
      {deckId === null ? (
        <section className="flex flex-col items-center gap-3 py-16 text-center">
          <h2 className="type-h2 tracking-[0.08em] text-text uppercase">{COPY.noDeck.title}</h2>
          <p className="max-w-[28rem] text-text-muted type-body">{COPY.noDeck.text}</p>
        </section>
      ) : (
        <SkyEditor key={deckId} deckId={deckId} faction={faction} />
      )}
    </main>
  )
}

/** Il costruttore di un Cielo: caselle, Fazione, avvisi, equilibrio e selettore. */
function SkyEditor({ deckId, faction }: { deckId: number; faction: Faction | null }) {
  const catalog = useCatalog()
  const { owned } = useCollection()
  const saved = useDeckToEdit(deckId)
  const save = useSaveDeck(deckId)

  const [name, setName] = useState(saved.name)
  const [slots, setSlots] = useState<SkySlots>(saved.slots)
  const [editingName, setEditingName] = useState(false)
  const [selected, setSelected] = useState<DeckSlot | null>(null)
  const [pickerElement, setPickerElement] = useState<Element | null>(null)
  const isDesktop = useMediaQuery(MEDIA.desktop)
  // Su desktop la colonna di destra non resta vuota: senza una scelta è aperto il Sole, come nella
  // tavola Collezione-Cielo. Su telefono e tablet la finestra si apre solo toccando una casella.
  const active = selected ?? (isDesktop ? 'SOLE' : null)

  const dirty = name.trim() !== saved.name || !sameSlots(slots, saved.slots)
  const warnings = skyWarnings(slots, catalog)
  // I problemi del backend valgono per il Cielo salvato: con modifiche in corso contano gli avvisi.
  const serverProblems = dirty ? [] : saved.problems
  const problemCount = warnings.length + serverProblems.length
  const cards = slotCards(slots, catalog)
  const counts = elementCounts(slots, catalog)
  const creaturesComplete = SKY_LAYOUT.every((s) => s === 'ASCENDANT' || slots[s] !== null)
  const benefiting = faction
    ? SKY_LAYOUT.filter((s) => s !== 'ASCENDANT' && cards[s]?.element === faction.element).length
    : 0
  const ascendant = cards.ASCENDANT
  const ascendantTargets = ascendant
    ? SKY_LAYOUT.filter((s) => s !== 'ASCENDANT' && cards[s]?.sign === ascendant.sign).map(
        (s) => cards[s]?.name ?? '',
      )
    : []

  /** Apre una casella nel selettore: colonna a destra su desktop, finestra sotto i 1280 px. */
  const open = (slot: DeckSlot, element: Element | null = null) => {
    setSelected(slot)
    setPickerElement(element)
  }

  /** Il selettore della casella aperta; nella finestra, scelta la carta, la finestra si chiude. */
  const picker = (inSheet: boolean, slot: DeckSlot | null) => (
    <SkyPicker
      key={`${slot}-${pickerElement}`}
      slot={slot}
      slots={slots}
      catalog={catalog}
      owned={owned}
      initialElement={pickerElement}
      inSheet={inSheet}
      onPick={(cardId) => {
        if (!slot) return
        setSlots((s) => ({ ...s, [slot]: cardId }))
        if (inSheet) setSelected(null)
      }}
    />
  )

  const fix = (warning: SkyWarning) => {
    if (warning.kind === 'MISSING') return open(warning.slots[0])
    if (warning.kind === 'ELEMENT_TOO_MANY') {
      const slot = SKY_LAYOUT.find(
        (s) => s !== 'ASCENDANT' && cards[s]?.element === warning.element,
      )
      return slot && open(slot)
    }
    // Manca un elemento: si propone di cambiare una carta dell'elemento più presente.
    const most = (Object.keys(counts) as Element[]).sort((a, b) => counts[b] - counts[a])[0]
    const slot = SKY_LAYOUT.find((s) => s !== 'ASCENDANT' && cards[s]?.element === most)
    return slot && open(slot, warning.element)
  }

  const submit = () =>
    save.mutate(
      { name: name.trim() || saved.name, slots },
      { onSuccess: () => setEditingName(false) },
    )

  const cancel = () => {
    setName(saved.name)
    setSlots(saved.slots)
    setSelected(null)
    save.reset()
  }

  const saveError =
    save.error instanceof ApiError && save.error.code === 'CARD_NOT_OWNED'
      ? COPY.notOwned
      : save.error
        ? COPY.saveFailed
        : null

  return (
    <div className="mt-8 grid gap-7 pb-10 xl:grid-cols-[minmax(0,1fr)_30rem]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {editingName ? (
            <input
              aria-label={COPY.nameLabel}
              value={name}
              maxLength={40}
              // Il campo compare quando il giocatore preme la matita: il focus segue la sua azione.
              ref={(el) => el?.focus()}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingName(false)}
              className="rounded-md h-10 min-w-0 border border-field-border bg-field-bg px-3 font-display text-[1.25rem] font-bold text-text"
            />
          ) : (
            <h2 className="flex items-center gap-2 font-display text-[1.25rem] font-bold tracking-[0.08em] text-text uppercase">
              {name || saved.name}
              <button
                type="button"
                aria-label={COPY.rename}
                onClick={() => setEditingName(true)}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-gold-bright"
              >
                <Icon name="modifica" size={16} />
              </button>
            </h2>
          )}
          <span
            className={`inline-flex h-7 items-center gap-1.5 rounded-pill px-3 inset-ring type-meta-strong ${
              problemCount === 0
                ? 'text-success inset-ring-success/60'
                : 'text-warning inset-ring-warning/60'
            }`}
          >
            <Icon name={problemCount === 0 ? 'conferma' : 'avviso'} size={14} />
            {problemCount === 0 ? COPY.valid : COPY.problems(problemCount)}
          </span>
          <span className="text-text-muted type-meta" aria-live="polite">
            {dirty
              ? COPY.unsaved
              : problemCount > 0
                ? COPY.notValidForChallenges
                : save.isSuccess
                  ? COPY.saved
                  : ''}
          </span>
          <span className="flex gap-3 xl:ml-auto">
            <SecondaryButton onClick={cancel} disabled={!dirty || save.isPending} className="w-32">
              {COPY.cancel}
            </SecondaryButton>
            <GoldButton onClick={submit} disabled={!dirty} busy={save.isPending} className="w-32">
              {save.isPending ? COPY.saving : COPY.save}
            </GoldButton>
          </span>
        </div>
        {saveError && <InlineError message={saveError} onRetry={submit} />}

        <FactionBand faction={faction} benefiting={benefiting} />

        <ul className="grid gap-3 md:grid-cols-2">
          {SKY_LAYOUT.map((slot) => (
            <li key={slot}>
              <SkySlotTile
                slot={slot}
                card={cards[slot]}
                selected={active === slot}
                ascendantTargets={slot === 'ASCENDANT' ? ascendantTargets : undefined}
                onSelect={() => open(slot)}
              />
            </li>
          ))}
        </ul>

        <SkyWarnings warnings={warnings} serverProblems={serverProblems} onFix={fix} />
        <ElementBalance counts={counts} complete={creaturesComplete} />
      </div>

      {isDesktop ? (
        // L'altezza la dà la colonna di sinistra: il pannello finisce con l'ultimo blocco
        // (Equilibrio degli elementi) e la lista scorre dentro, senza allungare la pagina.
        <div className="relative min-h-[28rem]">
          <div className="absolute inset-0">{picker(false, active)}</div>
        </div>
      ) : (
        selected && (
          <Dialog
            label={COPY.picker.title(
              selected === 'ASCENDANT'
                ? "l'Ascendente"
                : selected === 'SOLE'
                  ? 'il Sole'
                  : selected === 'LUNA'
                    ? 'la Luna'
                    : PLANET_LABELS[selected as PlanetCode],
            )}
            onClose={() => setSelected(null)}
            className="max-w-[36rem]"
          >
            {picker(true, selected)}
          </Dialog>
        )
      )}
    </div>
  )
}
