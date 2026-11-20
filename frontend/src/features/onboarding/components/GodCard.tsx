import altezze from '@/assets/factions/altezze.webp'
import campi from '@/assets/factions/campi.webp'
import fucina from '@/assets/factions/fucina.webp'
import pelago from '@/assets/factions/pelago.webp'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Medallion } from '@/components/ui/Medallion'
import { Pill } from '@/components/ui/Pill'
import { Spark } from '@/components/ui/Spark'
import type { GodCode } from '@/domain/game'
import { ELEMENT_LABELS, GOD_LABELS, GOD_REALMS, SIGN_GLYPHS, SIGN_LABELS } from '@/domain/labels'
import { GOD_ELEMENT, signsOf } from '@/domain/rules'

/** Il quarto dell'Eclittica di ogni Dio (arte del team, ritagliata per le Fazioni). */
const REALM_ART: Record<GodCode, string> = {
  EFESTO: fucina,
  POSEIDONE: pelago,
  DEMETRA: campi,
  ERA: altezze,
}

/** Proprietà di {@link GodCard}. */
export interface GodCardProps {
  god: GodCode
  /** Nome del gruppo di scelta: le quattro carte sono un'unica domanda. */
  name: string
  selected: boolean
  /** Il Dio proposto dal segno del giocatore: porta l'etichetta sopra la carta. */
  proposed: boolean
  disabled?: boolean
  onSelect: () => void
}

/**
 * Una Fazione da scegliere (tavola Benvenuto-Fazione): Tessera con il paesaggio del regno,
 * lo stemma dell'elemento, il Dio, i suoi tre segni e il potere. È un'opzione di una scelta
 * singola: un `radio` vero, nascosto, così frecce, Tab e screen reader funzionano da soli.
 * Scelta: alone d'oro attorno alla Tessera.
 */
export function GodCard({ god, name, selected, proposed, disabled, onSelect }: GodCardProps) {
  const element = GOD_ELEMENT[god]
  const { realm, land, power, effect } = GOD_REALMS[god]
  const signs = signsOf(element)
  const godName = GOD_LABELS[god].name

  return (
    <label
      className={`group relative flex cursor-pointer flex-col transition-[filter] duration-(--za-dur-fast) ${selected ? '[filter:var(--za-glow-selected)]' : ''}`}
    >
      <input
        type="radio"
        name={name}
        value={god}
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
        className="peer sr-only"
        aria-describedby={`${name}-${god}-potere`}
      />
      {proposed && (
        <Pill
          tone="outline"
          icon={<Spark />}
          className="absolute -top-2.5 left-1/2 z-10 -translate-x-1/2"
        >
          Proposta dal tuo segno
        </Pill>
      )}
      <TilePanel
        as="div"
        className="rounded-sm flex-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold-bright"
      >
        <div className="flex h-full flex-col">
          <div className="relative mx-2 mt-2 h-24 overflow-hidden rounded-[3px] bg-medallion-core lg:h-[8.875rem]">
            <img src={REALM_ART[god]} alt="" className="size-full object-cover" />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-surface/0 from-45% to-surface/95"
            />
          </div>
          <div className="relative -mt-10 flex flex-1 flex-col items-center gap-2 px-5 pb-5 text-center">
            <Medallion size={72} variant="large">
              <ElementEmblem element={element} size={60} />
            </Medallion>
            <h2 className="mt-1 type-h2 tracking-[0.08em] text-gold-bright uppercase">{godName}</h2>
            <p className="type-h3 text-text">{realm}</p>
            <p className="min-h-10 text-text-muted type-meta">{land}</p>
            <p
              className="font-symbol text-[1.25rem] tracking-[0.4em] text-gold-bright"
              aria-label={`Segni di ${ELEMENT_LABELS[element]}: ${signs.map((s) => SIGN_LABELS[s]).join(', ')}`}
            >
              {signs.map((s) => SIGN_GLYPHS[s]).join('')}
            </p>
            <div
              id={`${name}-${god}-potere`}
              className="mt-auto flex w-full flex-col gap-1 border-t border-text/10 pt-3"
            >
              <span className="text-gold-bright type-meta-strong">{power}</span>
              <span className="text-text type-body">{effect}</span>
            </div>
          </div>
        </div>
      </TilePanel>
    </label>
  )
}
