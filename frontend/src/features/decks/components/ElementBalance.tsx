import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import type { Element } from '@/domain/game'
import { ELEMENT_LABELS } from '@/domain/labels'
import { ELEMENT_RANGE, SKY_ELEMENTS } from '@/features/decks/sky'
import { SKY_COPY } from '@/features/decks/messages'

const COPY = SKY_COPY.balance

/** Colore dei rombi di ogni elemento (token degli elementi). */
const ELEMENT_FILL: Record<Element, string> = {
  FIRE: 'var(--za-el-fuoco)',
  WATER: 'var(--za-el-acqua)',
  EARTH: 'var(--za-el-terra)',
  AIR: 'var(--za-el-aria)',
}

/** Proprietà di {@link ElementBalance}. */
export interface ElementBalanceProps {
  counts: Record<Element, number>
  /** Si giudica solo con tutte le creature in campo: prima i numeri restano neutri. */
  complete: boolean
}

/**
 * Equilibrio degli elementi (S07, V8; tavole Collezione-Cielo e -Problemi): per ogni elemento il
 * numero e tre rombi; fuori da 1–3 la cella si accende con il testo, non solo con il colore.
 */
export function ElementBalance({ counts, complete }: ElementBalanceProps) {
  const off = (el: Element) =>
    complete && (counts[el] < ELEMENT_RANGE.min || counts[el] > ELEMENT_RANGE.max)
  const anyOff = SKY_ELEMENTS.some(off)
  return (
    <section aria-labelledby="sky-balance" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="sky-balance" className="type-eyebrow tracking-[0.12em] text-gold-bright uppercase">
          {COPY.title}
        </h2>
        {complete && (
          <span
            className={`flex items-center gap-1.5 type-meta-strong ${anyOff ? 'text-warning' : 'text-success'}`}
          >
            <Icon name={anyOff ? 'avviso' : 'conferma'} size={14} />
            {anyOff ? COPY.off : COPY.ok}
          </span>
        )}
      </div>
      <TilePanel as="div">
        <ul className="grid grid-cols-2 md:grid-cols-4">
          {SKY_ELEMENTS.map((el, i) => (
            <li
              key={el}
              className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? 'md:border-l md:border-line-thin' : ''} ${
                off(el) ? 'bg-warning/10' : ''
              }`}
            >
              <span aria-hidden="true">
                <ElementEmblem element={el} size={24} />
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-text type-meta-strong">
                  <span className="sr-only">{COPY.label(counts[el], ELEMENT_LABELS[el])}</span>
                  <span aria-hidden="true">
                    {ELEMENT_LABELS[el]} {counts[el]}
                  </span>
                  {off(el) && (
                    <span className="ml-1 text-warning type-caption">· {COPY.range}</span>
                  )}
                </span>
                <span aria-hidden="true" className="flex gap-1.5">
                  {Array.from({ length: ELEMENT_RANGE.max }, (_, k) => (
                    <span
                      key={k}
                      className="size-2 rotate-45 border"
                      style={{
                        borderColor: ELEMENT_FILL[el],
                        background: k < counts[el] ? ELEMENT_FILL[el] : 'transparent',
                      }}
                    />
                  ))}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </TilePanel>
    </section>
  )
}
