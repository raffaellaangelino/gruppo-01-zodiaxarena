import { TilePanel } from '@/components/panels/TilePanel'
import { Coin } from '@/components/ui/Coin'
import { GoldButton } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { SlotTokens } from '@/features/shop/components/SlotTokens'
import { slotsText } from '@/features/shop/slots'
import { SHOP_COPY } from '@/features/shop/messages'
import { packArt } from '@/features/shop/packArt'
import type { ShopPack } from '@/features/shop/types'
import { daysUntil } from '@/lib/dates'

const COPY = SHOP_COPY

/** Proprietà di {@link PackPanel}. */
export interface PackPanelProps {
  pack: ShopPack
  balance: number
  onOpen: () => void
}

/**
 * Un pacchetto in vendita (tavola Negozio, gen_ng.pack_panel): busta, nome e ruolo; la struttura
 * per slot con il testo, la garanzia e il limite; Moneta e prezzo, APRI e, sotto, il saldo dopo
 * oppure il motivo per cui è spento ("Ti mancano 40 crediti", "Già aperto in questo ciclo").
 */
export function PackPanel({ pack, balance, onOpen }: PackPanelProps) {
  const ok = pack.available
  const ascendant = pack.guarantees.includes('ASCENDANT')
  return (
    <TilePanel as="article" aria-label={pack.name} className="md:flex-1">
      <div className="flex h-full flex-col items-center gap-3 px-7 pt-6 pb-5 text-center">
        <img
          src={packArt(pack.code)}
          alt={`Pacchetto ${pack.name}, ${pack.cardCount} carte`}
          className="h-[13.5rem] w-auto drop-shadow-[0_18px_24px_rgb(0_0_0/55%)]"
        />
        <div className="flex flex-col items-center gap-1">
          <h2 className="type-h3 tracking-[0.08em] text-gold-bright uppercase">{pack.name}</h2>
          <p className="text-text-soft type-meta">{pack.role}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-2 border-y border-line-soft py-3">
          <SlotTokens slots={pack.slots} />
          <span className="text-text-muted type-meta">
            {COPY.cards(pack.cardCount)} · {slotsText(pack.slots)}
          </span>
          <span className="flex min-h-5 flex-wrap justify-center gap-4 type-meta">
            {ascendant && (
              <span className="inline-flex items-center gap-1.5 font-extrabold text-gold-bright">
                <Icon name="conferma" size={16} />
                {COPY.ascendantGuaranteed}
              </span>
            )}
            {pack.limit && (
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <Icon name="luna-piena" size={16} />
                {COPY.oncePerCycle}
              </span>
            )}
          </span>
        </div>
        <div className="mt-auto flex flex-col items-center gap-2 pt-3">
          <p className="flex items-center gap-3">
            <span className={ok ? '' : 'opacity-50 grayscale'}>
              <Coin size={32} />
            </span>
            <b
              className={`font-display text-[2rem] leading-none ${ok ? 'text-nav-ink-active' : 'text-text-muted'}`}
            >
              {pack.price}
            </b>
            <span className="text-text-muted type-meta">{COPY.credits}</span>
          </p>
          <GoldButton onClick={onOpen} disabled={!ok} className="w-50">
            {COPY.open}
          </GoldButton>
          <PackState pack={pack} balance={balance} />
        </div>
      </div>
    </TilePanel>
  )
}

/** Sotto APRI: il saldo dopo l'acquisto, oppure perché non si può aprire. */
function PackState({ pack, balance }: { pack: ShopPack; balance: number }) {
  if (pack.unavailableReason === 'LIMIT_REACHED') {
    const days = pack.availableAgainAt ? daysUntil(pack.availableAgainAt) : 0
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-text-muted type-meta">
        <Icon name="luna-piena" size={16} />
        {COPY.limitReached(days)}
      </span>
    )
  }
  if (pack.unavailableReason === 'INSUFFICIENT_CREDITS') {
    return (
      <span className="inline-flex items-center gap-1.5 font-bold text-warning type-meta">
        <Coin size={16} />
        {COPY.short(pack.price - balance)}
      </span>
    )
  }
  return (
    <span className="text-text-muted type-meta">
      {COPY.balanceAfter} <b className="text-text">{balance - pack.price}</b>
    </span>
  )
}
