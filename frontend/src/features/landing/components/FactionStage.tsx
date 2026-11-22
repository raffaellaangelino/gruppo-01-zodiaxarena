import { useRef, useState, type KeyboardEvent } from 'react'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Medallion } from '@/components/ui/Medallion'
import type { GodCode } from '@/domain/game'
import { GOD_LABELS, GOD_REALMS, SIGN_GLYPHS, SIGN_LABELS } from '@/domain/labels'
import { GODS, GOD_ELEMENT, signsOf } from '@/domain/rules'
import { LANDING_COPY } from '@/features/landing/messages'
import { GOD_PORTRAITS } from '@/features/onboarding/godPortraits'

const COPY = LANDING_COPY.factions

/**
 * Le quattro Fazioni su un unico palco: le schede (stemma e nome) scelgono il Dio, il palco mostra
 * la sua carta, il regno, i segni e il potere. Schede vere (`tablist`): le frecce passano da un Dio
 * all'altro. Lo stato scelto è un filo d'oro sotto la scheda, senza alone (FOUNDATIONS §6b-quinquies).
 */
export function FactionStage() {
  const [god, setGod] = useState<GodCode>('EFESTO')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const element = GOD_ELEMENT[god]
  const { realm, land, power, effect } = GOD_REALMS[god]

  const onKey = (e: KeyboardEvent, index: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (index + step + GODS.length) % GODS.length
    setGod(GODS[next])
    tabs.current[next]?.focus()
  }

  return (
    <div className="flex flex-col gap-10">
      <div
        role="tablist"
        aria-label={COPY.tabs}
        className="mx-auto grid w-full max-w-[44rem] grid-cols-4 border-b border-line-soft"
      >
        {GODS.map((g, i) => {
          const selected = g === god
          return (
            <button
              key={g}
              ref={(el) => {
                tabs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`fazione-${g}`}
              aria-selected={selected}
              aria-controls="fazione-palco"
              tabIndex={selected ? 0 : -1}
              onClick={() => setGod(g)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative flex cursor-pointer flex-col items-center gap-2 border-0 bg-transparent px-1 pt-1 pb-3 type-button tracking-[0.12em] uppercase transition-colors duration-(--za-dur-fast) ${
                selected ? 'text-nav-ink-active' : 'text-nav-ink hover:text-text'
              }`}
            >
              <span aria-hidden="true" className={selected ? '' : 'opacity-60'}>
                <ElementEmblem element={GOD_ELEMENT[g]} size={32} />
              </span>
              {GOD_LABELS[g].name}
              <span
                aria-hidden="true"
                className={`absolute inset-x-[18%] -bottom-px h-0.5 bg-gold-bright transition-transform duration-(--za-dur-base) ${
                  selected ? 'scale-x-100' : 'scale-x-0'
                }`}
              />
            </button>
          )
        })}
      </div>

      <div
        key={god}
        id="fazione-palco"
        role="tabpanel"
        aria-labelledby={`fazione-${god}`}
        className="landing-fade grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] xl:gap-16"
      >
        <img
          src={GOD_PORTRAITS[god]}
          alt=""
          loading="lazy"
          className="mx-auto w-full max-w-[24rem] rounded-(--za-card-radius) shadow-card"
        />
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <Medallion size={72} variant="large">
            <ElementEmblem element={element} size={60} />
          </Medallion>
          <h3 className="tracking-[0.08em] text-gold-bright uppercase type-h1-m xl:type-h1">
            {GOD_LABELS[god].name}
          </h3>
          <p className="type-h3 text-text">{realm}</p>
          <p className="max-w-[28rem] text-text-muted type-body">{land}</p>
          <p className="flex flex-wrap gap-x-5 gap-y-1 text-text-soft type-meta">
            <span className="sr-only">{COPY.signs}: </span>
            {signsOf(element).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="font-symbol text-[1.125rem] text-gold-bright">
                  {SIGN_GLYPHS[s]}
                </span>
                {SIGN_LABELS[s]}
              </span>
            ))}
          </p>
          <div className="mt-2 flex w-full max-w-[28rem] flex-col gap-1 border-t border-line-soft pt-4">
            <span className="text-gold-bright type-meta-strong">{power}</span>
            <span className="text-text type-body">{effect}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
