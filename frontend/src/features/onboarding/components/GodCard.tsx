import { Pill } from '@/components/ui/Pill'
import { Spark } from '@/components/ui/Spark'
import type { GodCode } from '@/domain/game'
import { GodPanel } from '@/features/onboarding/components/GodPanel'

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
 * Una Fazione da scegliere (tavola Benvenuto-Fazione): Tessera con il ritratto del Dio,
 * lo stemma dell'elemento, il Dio, i suoi tre segni e il potere. È un'opzione di una scelta
 * singola: un `radio` vero, nascosto, così frecce, Tab e screen reader funzionano da soli.
 * Scelta: alone d'oro attorno alla Tessera.
 */
export function GodCard({ god, name, selected, proposed, disabled, onSelect }: GodCardProps) {
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
      <GodPanel
        god={god}
        powerId={`${name}-${god}-potere`}
        className="rounded-sm flex-1 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold-bright"
      />
    </label>
  )
}
