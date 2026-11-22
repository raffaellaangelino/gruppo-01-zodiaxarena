import { SLOT_LABELS } from '@/features/shop/messages'
import type { SlotType } from '@/features/shop/types'

/**
 * La struttura in parole, nell'ordine Comuni · Rare · Epiche · Ascendenti · Stella.
 *
 * @param slots Struttura del pacchetto.
 * @returns "3 Comuni · 1 Rara · 1 Stella".
 */
export function slotsText(slots: readonly SlotType[]): string {
  const order: SlotType[] = ['COMMON', 'RARE', 'EPIC', 'ASCENDANT', 'STAR']
  return order
    .map((type) => {
      const n = slots.filter((s) => s === type).length
      return n === 0 ? null : `${n} ${SLOT_LABELS[type][n === 1 ? 0 : 1]}`
    })
    .filter(Boolean)
    .join(' · ')
}
