import { Spark } from '@/components/ui/Spark'
import { SLOT_LABELS } from '@/features/shop/messages'
import type { SlotType } from '@/features/shop/types'

/** Colore di ogni rarità (token dei tier). */
const SLOT_BG: Record<Exclude<SlotType, 'STAR'>, string> = {
  COMMON: 'var(--za-tier-comune)',
  RARE: 'var(--za-tier-rara)',
  EPIC: 'var(--za-tier-epica)',
  ASCENDANT: 'linear-gradient(135deg, #7af0ff, #c89bff, #ffe38a)',
}

/**
 * La struttura fissa del pacchetto (FOUNDATIONS §6b-octies): un dorso per carta, colorato per
 * rarità; la Stella è un dorso con la scintilla. Decorativo: accanto c'è sempre il testo
 * ("5 carte · 3 Comuni · 1 Rara · 1 Stella").
 */
export function SlotTokens({ slots, size = 18 }: { slots: readonly SlotType[]; size?: number }) {
  return (
    <span aria-hidden="true" className="flex flex-wrap justify-center gap-1">
      {slots.map((slot, i) =>
        slot === 'STAR' ? (
          <span
            key={i}
            title={SLOT_LABELS.STAR[0]}
            className="flex items-center justify-center rounded-[3px] bg-bg-deep shadow-[inset_0_0_0_1.5px_var(--za-tier-leggendaria-text)]"
            style={{ width: size, height: Math.round(size * 1.4) }}
          >
            <Spark size={Math.round(size * 0.6)} />
          </span>
        ) : (
          <span
            key={i}
            title={SLOT_LABELS[slot][0]}
            className="rounded-[3px] shadow-[inset_0_0_0_1px_rgb(255_255_255/25%),inset_0_-8px_10px_rgb(0_0_0/25%)]"
            style={{ width: size, height: Math.round(size * 1.4), background: SLOT_BG[slot] }}
          />
        ),
      )}
    </span>
  )
}
