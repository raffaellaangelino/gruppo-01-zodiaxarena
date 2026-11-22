import { useState } from 'react'
import { cardArtUrl } from '@/components/game/cardArt'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { GameCard } from '@/components/game/GameCard'
import type { SignCode } from '@/domain/game'
import { ELEMENT_LABELS, GOD_LABELS, SIGN_GLYPHS, SIGN_IN, SIGN_LABELS } from '@/domain/labels'
import { ELEMENT_GOD, SIGN_ELEMENT } from '@/domain/rules'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { LANDING_COPY } from '@/features/landing/messages'

const COPY = LANDING_COPY.sign

/** I dodici segni, nell'ordine dello zodiaco (e del catalogo dei Soli, za-001 … za-012). */
const SIGNS = Object.keys(SIGN_LABELS) as SignCode[]

/** Il Sole di un segno nel catalogo: `za-005-sole-leone`. */
const sunCode = (sign: SignCode) =>
  `za-${String(SIGNS.indexOf(sign) + 1).padStart(3, '0')}-sole-${sign.toLowerCase()}`

/**
 * "Il tuo segno": sulla ruota dello zodiaco si sceglie uno dei dodici segni e al centro compare il
 * suo Sole, la prima carta del Cielo,
 * con l'elemento e la Fazione proposta (la stessa regola della registrazione: il Dio dell'elemento).
 * È un `radio` vero per segno, nascosto (gruppo `radiogroup`): frecce, Tab e screen reader funzionano da soli.
 */
export function SignPicker() {
  const [sign, setSign] = useState<SignCode>('LEONE')
  const element = SIGN_ELEMENT[sign]
  const god = ELEMENT_GOD[element]
  const cardName = `Sole ${SIGN_IN[sign]}`

  return (
    <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_auto] xl:gap-16">
      <div className="flex flex-col gap-5">
        <SectionHeading
          id="landing-sign"
          eyebrow={COPY.eyebrow}
          title={COPY.title}
          lore={COPY.lore}
        />
        <p aria-hidden="true" className="flex items-center gap-2 text-gold-bright type-meta-strong">
          <span className="size-1.5 rotate-45 bg-gold-bright" />
          {COPY.hint}
        </p>
      </div>

      <figure className="m-0 flex flex-col items-center gap-6">
        {/* La ruota dello zodiaco (la stessa della key art): i dodici segni in cerchio attorno al Sole */}
        {/* Un contenitore normale, non un fieldset: dentro un fieldset Chrome non centra gli elementi posizionati */}
        <div
          role="radiogroup"
          aria-label={COPY.pick}
          className="relative size-[21rem] [--r:9.25rem] xl:size-[36rem] xl:[--r:16.25rem]"
        >
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 size-[calc(var(--r)*2)] -translate-1/2 rounded-full border border-line-soft"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div key={sign} className="landing-flip w-[8.25rem] xl:w-[15rem]">
              <GameCard
                size="fluid"
                imageUrl={cardArtUrl(sunCode(sign))}
                label={cardName}
                aura="LEGENDARY"
              />
            </div>
          </div>
          {SIGNS.map((s, i) => (
            <label
              key={s}
              aria-label={SIGN_LABELS[s]}
              title={SIGN_LABELS[s]}
              className="group absolute top-1/2 left-1/2 cursor-pointer"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(calc(var(--r) * -1)) rotate(${-i * 30}deg)`,
              }}
            >
              <input
                type="radio"
                name="landing-sign"
                value={s}
                checked={sign === s}
                onChange={() => setSign(s)}
                className="peer sr-only"
              />
              <span className="flex size-11 items-center justify-center rounded-full bg-(image:--za-medallion-fill) text-text-soft shadow-[inset_0_0_0_1px_var(--za-line-soft)] transition-[color,box-shadow] duration-(--za-dur-fast) group-hover:text-text peer-checked:text-nav-ink-active peer-checked:shadow-[inset_0_0_0_1.5px_var(--za-gold-bright)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-bright xl:size-12">
                <span
                  aria-hidden="true"
                  className="font-symbol text-[1.375rem] leading-none xl:text-[1.5rem]"
                >
                  {SIGN_GLYPHS[s]}
                </span>
              </span>
            </label>
          ))}
        </div>
        <figcaption aria-live="polite" className="flex flex-col items-center gap-2 text-center">
          <span className="type-h3 text-text uppercase">{cardName}</span>
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-text-soft type-meta">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true">
                <ElementEmblem element={element} size={20} />
              </span>
              {COPY.element}: {ELEMENT_LABELS[element]}
            </span>
            <span aria-hidden="true" className="h-3 w-px bg-line-soft" />
            <span>
              {COPY.faction}: <b className="text-gold-bright">{GOD_LABELS[god].name}</b>
            </span>
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
