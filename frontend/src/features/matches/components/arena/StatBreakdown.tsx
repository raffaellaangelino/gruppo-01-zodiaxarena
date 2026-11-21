import type { ReactNode } from 'react'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import type { OpenStat } from '@/features/matches/components/arena/ArenaCreatureCard'
import { MATCH_COPY } from '@/features/matches/messages'
import { formatNumber, type ArenaCreature } from '@/features/matches/replay'

const COPY = MATCH_COPY.arena
const signed = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `+${n}`)

/** Una riga del calcolo: voce a sinistra, numero a destra. */
function Row({ label, meta, value }: { label: ReactNode; meta?: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1 text-text-muted type-meta">
      <span>
        {label}
        {meta && <span className="text-text-muted/80"> · {meta}</span>}
      </span>
      <b className="text-text tabular-nums">{value}</b>
    </div>
  )
}

/** Proprietà di {@link StatBreakdown}. */
export interface StatBreakdownProps {
  creature: ArenaCreature
  stat: OpenStat
  onClose: () => void
  className?: string
}

/**
 * Il calcolo di un valore (ux/challenge-replay.md, "Spiegare i numeri"): base del segno o dadi
 * d'Aria, poi ogni bonus con la sua origine, il totale all'ingresso, i colpi subiti e il valore
 * di ora. Il giocatore non deve mai fare i conti a mente. Solo i numeri dell'engine.
 */
export function StatBreakdown({ creature, stat, onClose, className = '' }: StatBreakdownProps) {
  const parts = stat === 'atk' ? creature.attackParts : creature.defenseParts
  const title =
    stat === 'atk' ? COPY.attackOf(creature.card.name) : COPY.defenseOf(creature.card.name)
  const hurt = creature.defense < creature.defenseMax
  return (
    <TilePanel as="div" aria-label={title} className={className}>
      <div className="flex flex-col px-4.5 pt-3.5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="pt-1 font-display text-[0.75rem] font-bold tracking-[0.1em] text-gold uppercase">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={COPY.closeBreakdown}
            className="-mt-1 -mr-2 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-text-muted"
          >
            <Icon name="chiudi" size={16} />
          </button>
        </div>
        {/* La base c'è sempre; le voci a zero (es. Mercurio in DEF) non spiegano nulla */}
        {parts.map((part, i) =>
          i > 0 && part.amount === 0 ? null : (
            <Row
              key={`${part.label}-${i}`}
              label={i === 0 ? COPY.base(part.label) : part.label}
              value={i === 0 ? formatNumber(part.amount) : signed(part.amount)}
            />
          ),
        )}
        {stat === 'def' ? (
          <>
            <div className="mt-1 border-t border-line-thin pt-1">
              <Row
                label={<span className="text-text">{COPY.atEntry}</span>}
                value={String(creature.defenseMax)}
              />
            </div>
            {creature.hits.map((hit) => (
              <Row
                key={`${hit.round}-${hit.attacker.name}`}
                label={COPY.hit(hit.attacker.name)}
                meta={COPY.roundShort(hit.round)}
                value={signed(hit.amount)}
              />
            ))}
            <div className="mt-1 flex justify-between border-t border-line-thin pt-2 type-body-strong">
              <span className="text-text">{COPY.now}</span>
              <span className={`tabular-nums ${hurt ? 'text-stat-hurt' : 'text-text'}`}>
                {formatNumber(creature.defense)}
              </span>
            </div>
          </>
        ) : (
          <div className="mt-1 flex justify-between border-t border-line-thin pt-2 type-body-strong">
            <span className="text-text">{COPY.thisRound}</span>
            <span className="text-text tabular-nums">{creature.attack}</span>
          </div>
        )}
      </div>
    </TilePanel>
  )
}
