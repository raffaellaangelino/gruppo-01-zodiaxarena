import { Link } from 'react-router'
import { PlayerAvatar } from '@/components/game/PlayerAvatar'
import { Pill } from '@/components/ui/Pill'
import type { PlayerRef } from '@/domain/game'
import { NEW_CHALLENGE_COPY } from '@/features/challenges/messages'

/** Un avversario da scegliere. */
export interface OpponentOption {
  player: PlayerRef
  /** Riga sotto il nome (es. "ultima sfida 8 nov"). */
  meta?: string
  /** Dove vedere la sfida già in attesa con lui; se c'è, non si può scegliere. */
  pendingHref?: string
}

/** Proprietà di {@link OpponentList}. */
export interface OpponentListProps {
  /** Titolo del gruppo (es. "Avversari recenti"). */
  title: string
  /** Nome del gruppo di scelta: tutte le liste della finestra sono un'unica domanda. */
  name: string
  options: OpponentOption[]
  selectedId: number | null
  onSelect: (player: PlayerRef) => void
}

/**
 * Lista di avversari da scegliere (tavola Sfide-Nuova): righe con medaglione e nome; quella scelta
 * ha il fondo acceso, il filo d'oro e "Scelto". Chi ha già una sfida in attesa con te è spento,
 * con "già in attesa · Vedi". Ogni riga è un `radio` vero, nascosto: frecce, Tab e screen reader
 * funzionano da soli.
 */
export function OpponentList({ title, name, options, selectedId, onSelect }: OpponentListProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 type-eyebrow tracking-[0.1em] text-gold uppercase">{title}</legend>
      {options.map(({ player, meta, pendingHref }) => {
        const selected = selectedId === player.id
        return (
          <label
            key={player.id}
            className={`relative flex items-center gap-3 rounded-thumb p-3 ${pendingHref ? 'cursor-default opacity-60' : 'cursor-pointer hover:bg-surface-2/60'} ${selected ? 'bg-surface-3/55 inset-ring inset-ring-gold-bright/60' : ''} has-focus-visible:outline-2 has-focus-visible:outline-gold-bright`}
          >
            <input
              type="radio"
              name={name}
              value={player.id}
              checked={selected}
              disabled={!!pendingHref}
              onChange={() => onSelect(player)}
              className="sr-only"
            />
            <PlayerAvatar player={player} size={40} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-text type-body-strong">{player.nickname}</span>
              {meta && <span className="text-text-muted type-meta">{meta}</span>}
            </span>
            {pendingHref ? (
              <span className="text-text-muted type-meta">
                {NEW_CHALLENGE_COPY.alreadyPending} ·{' '}
                <Link to={pendingHref} className="font-bold text-gold-bright no-underline">
                  {NEW_CHALLENGE_COPY.see} ›
                </Link>
              </span>
            ) : (
              selected && <Pill tone="outline">{NEW_CHALLENGE_COPY.selected}</Pill>
            )}
          </label>
        )
      })}
    </fieldset>
  )
}
