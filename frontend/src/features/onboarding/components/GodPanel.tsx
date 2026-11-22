import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Medallion } from '@/components/ui/Medallion'
import type { GodCode } from '@/domain/game'
import { ELEMENT_LABELS, GOD_LABELS, GOD_REALMS, SIGN_GLYPHS, SIGN_LABELS } from '@/domain/labels'
import { GOD_ELEMENT, signsOf } from '@/domain/rules'
import { GOD_PORTRAITS } from '@/features/onboarding/godPortraits'

/** Proprietà di {@link GodPanel}. */
export interface GodPanelProps {
  god: GodCode
  /** Id della riga del potere, per collegarla alla scelta (`aria-describedby`). */
  powerId?: string
  /** Livello del nome del Dio (h2 nella scelta della Fazione, h3 dentro una sezione). */
  headingLevel?: 'h2' | 'h3'
  className?: string
}

/**
 * Una Fazione (tavole Fazione e Benvenuto-Fazione): Tessera con il ritratto del Dio, lo stemma
 * dell'elemento, il Dio, il suo regno, i tre segni e il potere. La scelta della Fazione la usa
 * dentro un'opzione ({@link GodCard}); la landing la mostra così com'è.
 */
export function GodPanel({ god, powerId, headingLevel = 'h2', className = '' }: GodPanelProps) {
  const Heading = headingLevel
  const element = GOD_ELEMENT[god]
  const { realm, land, power, effect } = GOD_REALMS[god]
  const signs = signsOf(element)
  const godName = GOD_LABELS[god].name

  return (
    <TilePanel as="div" className={className}>
      <div className="flex h-full flex-col">
        {/* Volto e busto del Dio senza la cornice della carta (gen_pf.GOD_CROP); su mobile la striscia è più bassa, quindi il taglio sale */}
        <div
          className="relative mx-2 mt-2 h-24 overflow-hidden rounded-[3px] bg-medallion-core bg-size-[112%_auto] bg-position-[50%_12%] bg-no-repeat lg:h-[8.875rem] lg:bg-position-[50%_24%]"
          style={{ backgroundImage: `url(${GOD_PORTRAITS[god]})` }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-surface/0 from-45% to-surface/95"
          />
        </div>
        <div className="relative -mt-10 flex flex-1 flex-col items-center gap-2 px-5 pb-5 text-center">
          <Medallion size={72} variant="large">
            <ElementEmblem element={element} size={60} />
          </Medallion>
          <Heading className="mt-1 type-h2 tracking-[0.08em] text-gold-bright uppercase">
            {godName}
          </Heading>
          <p className="type-h3 text-text">{realm}</p>
          <p className="min-h-10 text-text-muted type-meta">{land}</p>
          <p
            className="font-symbol text-[1.25rem] tracking-[0.4em] text-gold-bright"
            aria-label={`Segni di ${ELEMENT_LABELS[element]}: ${signs.map((s) => SIGN_LABELS[s]).join(', ')}`}
          >
            {signs.map((s) => SIGN_GLYPHS[s]).join('')}
          </p>
          <div
            id={powerId}
            className="mt-auto flex w-full flex-col gap-1 border-t border-text/10 pt-3"
          >
            <span className="text-gold-bright type-meta-strong">{power}</span>
            <span className="text-text type-body">{effect}</span>
          </div>
        </div>
      </div>
    </TilePanel>
  )
}
