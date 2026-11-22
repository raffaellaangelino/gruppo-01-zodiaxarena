import { Dialog } from '@/components/overlay/Dialog'
import { Coin } from '@/components/ui/Coin'
import { GoldButton } from '@/components/ui/GoldButton'
import { InlineError } from '@/components/ui/InlineError'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { SlotTokens } from '@/features/shop/components/SlotTokens'
import { SHOP_COPY } from '@/features/shop/messages'
import { packArt } from '@/features/shop/packArt'
import type { ShopPack } from '@/features/shop/types'

const COPY = SHOP_COPY.confirm

/** Proprietà di {@link PackConfirmDialog}. */
export interface PackConfirmDialogProps {
  pack: ShopPack
  balance: number
  busy: boolean
  failed: boolean
  onConfirm: () => void
  onClose: () => void
}

/**
 * Conferma dell'acquisto (tavola Negozio-Conferma): spendere crediti non si annulla, quindi una
 * finestra breve con la conseguenza (saldo prima → dopo) e la rassicurazione che le carte sono
 * tue appena le apri. Se l'acquisto non va, l'errore sta dove si è agito e il saldo non cambia.
 */
export function PackConfirmDialog({
  pack,
  balance,
  busy,
  failed,
  onConfirm,
  onClose,
}: PackConfirmDialogProps) {
  const [from, to] = COPY.balance(balance, balance - pack.price)
  return (
    <Dialog label={COPY.title(pack.name)} onClose={onClose} className="max-w-[45rem]">
      <div className="flex flex-col items-center gap-8 px-6 py-8 md:flex-row md:px-12 md:py-10">
        <img
          src={packArt(pack.code)}
          alt=""
          className="h-52 w-auto shrink-0 drop-shadow-[0_18px_24px_rgb(0_0_0/55%)]"
        />
        <div className="flex flex-col gap-4">
          <h1 className="text-text type-h1-m xl:type-h1">{COPY.title(pack.name)}</h1>
          <p className="flex flex-wrap items-center gap-3 type-body">
            <Coin size={28} />
            <b className="text-[1.25rem]">
              {pack.price} {SHOP_COPY.credits}
            </b>
            <span className="text-text-muted">
              · {from} <b className="text-text">{to}</b>
            </span>
          </p>
          <SlotTokens slots={pack.slots} size={14} />
          <p className="text-text-muted type-meta">{COPY.reassure}</p>
          {failed && <InlineError message={COPY.failed} onRetry={onConfirm} />}
          <div className="mt-2 flex gap-3">
            <SecondaryButton
              onClick={onClose}
              disabled={busy}
              className="flex-1 md:w-35 md:flex-none"
            >
              {COPY.cancel}
            </SecondaryButton>
            <GoldButton onClick={onConfirm} busy={busy} className="flex-1 md:w-50 md:flex-none">
              {busy ? COPY.opening : COPY.open(pack.price)}
            </GoldButton>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
