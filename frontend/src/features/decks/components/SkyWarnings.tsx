import { TilePanel } from '@/components/panels/TilePanel'
import type { Element, PlanetCode } from '@/domain/game'
import { ELEMENT_LABELS, PLANET_LABELS } from '@/domain/labels'
import { SKY_COPY } from '@/features/decks/messages'
import type { SkyWarning } from '@/features/decks/sky'
import type { DeckSlot } from '@/features/decks/types'

const COPY = SKY_COPY.warnings

/** "d'Acqua", "di Fuoco". */
const ofElement = (element: Element) => {
  const label = ELEMENT_LABELS[element]
  return /^[AEIOU]/.test(label) ? `d'${label}` : `di ${label}`
}

/** Nome della casella: il pianeta, oppure "l'Ascendente". */
const slotName = (slot: DeckSlot) =>
  slot === 'ASCENDANT' ? "l'Ascendente" : PLANET_LABELS[slot as PlanetCode]

/** Un problema mandato dal backend (`DeckProblem`), quando le regole V1–V8 saranno attive. */
export interface ServerProblem {
  rule: string
  code: string
  element?: string
}

/** Proprietà di {@link SkyWarnings}. */
export interface SkyWarningsProps {
  warnings: SkyWarning[]
  serverProblems: ServerProblem[]
  /** Apre il selettore sulla casella che risolve l'avviso. */
  onFix: (warning: SkyWarning) => void
}

/**
 * "Da correggere" (S07, tavola Collezione-Cielo-Problemi): ogni avviso in parole del giocatore,
 * con l'azione che lo risolve. Gli avvisi sono un'anteprima finché il backend non manda i suoi
 * problemi; quelli del backend, quando ci sono, si mostrano con la regola e il codice.
 */
export function SkyWarnings({ warnings, serverProblems, onFix }: SkyWarningsProps) {
  if (warnings.length === 0 && serverProblems.length === 0) return null
  const row = (
    key: string,
    text: string,
    hint: string,
    action?: { label: string; run: () => void },
  ) => (
    <li key={key} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5">
      <span className="flex items-baseline gap-2 text-text type-meta">
        <span aria-hidden="true" className="size-2 shrink-0 rotate-45 border border-warning" />
        <span>
          <b>{text}</b> {hint}
        </span>
      </span>
      {action && (
        <button
          type="button"
          onClick={action.run}
          className="cursor-pointer border-0 bg-transparent p-0 text-gold-bright type-meta-strong"
        >
          {action.label} ›
        </button>
      )}
    </li>
  )
  return (
    <TilePanel as="div" aria-label={COPY.title}>
      <div className="flex flex-col gap-1 px-5 py-4">
        <h2 className="type-eyebrow tracking-[0.12em] text-gold-bright uppercase">{COPY.title}</h2>
        <ul className="flex flex-col divide-y divide-line-thin">
          {warnings.map((w) => {
            if (w.kind === 'MISSING') {
              const names = w.slots.map(slotName).join(', ')
              return row('missing', COPY.missing(names), COPY.missingHint, {
                label: COPY.missingAction(slotName(w.slots[0])),
                run: () => onFix(w),
              })
            }
            if (w.kind === 'ELEMENT_NONE') {
              return row(`none-${w.element}`, COPY.none(ofElement(w.element)), COPY.noneHint, {
                label: COPY.noneAction(ofElement(w.element)),
                run: () => onFix(w),
              })
            }
            return row(
              `many-${w.element}`,
              COPY.tooMany(ofElement(w.element)),
              COPY.tooManyHint(w.count),
              { label: COPY.tooManyAction, run: () => onFix(w) },
            )
          })}
          {serverProblems.map((p) =>
            row(
              `srv-${p.rule}-${p.code}`,
              COPY.server,
              `${p.rule} · ${p.code}${p.element ? ` · ${p.element}` : ''}`,
            ),
          )}
        </ul>
        {warnings.length > 0 && <p className="mt-1 text-text-muted type-caption">{COPY.preview}</p>}
      </div>
    </TilePanel>
  )
}
