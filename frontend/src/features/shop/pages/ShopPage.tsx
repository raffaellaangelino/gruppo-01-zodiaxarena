import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { packOpeningPath } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { Coin } from '@/components/ui/Coin'
import { PackConfirmDialog } from '@/features/shop/components/PackConfirmDialog'
import { PackPanel } from '@/features/shop/components/PackPanel'
import { TrustBand } from '@/features/shop/components/TrustBand'
import { SHOP_COPY } from '@/features/shop/messages'
import { usePurchasePack, useShop } from '@/features/shop/queries'
import type { ShopPack } from '@/features/shop/types'

const COPY = SHOP_COPY

/**
 * Negozio (S04, tavola Negozio, FOUNDATIONS §6b-octies): tre pacchetti alla pari ordinati per
 * prezzo, senza un pacchetto in vetrina (la trasparenza viene prima della vendita); in alto il
 * saldo; in basso la banda della trasparenza. APRI chiede conferma con la conseguenza, poi si
 * passa all'apertura. Su desktop sta in uno schermo (1440 × 900); su telefono i pacchetti si
 * impilano.
 */
export function ShopPage() {
  const shop = useShop()
  const purchase = usePurchasePack()
  const navigate = useNavigate()

  const location = useLocation()

  // "Aprine un altro" dal riepilogo: si torna qui con la conferma dello stesso pacchetto già aperta
  const reopen = (location.state as { reopen?: string } | null)?.reopen
  const [chosen, setChosen] = useState<{ pack: ShopPack; key: string } | null>(() => {
    const pack = shop.packs.find((p) => p.code === reopen && p.available)
    return pack ? { pack, key: crypto.randomUUID() } : null
  })
  // Poi la richiesta si toglie dalla navigazione, così non si riapre ricaricando
  useEffect(() => {
    if (reopen) navigate(location.pathname, { replace: true, state: null })
  }, [reopen, navigate, location.pathname])

  const open = (pack: ShopPack) => {
    purchase.reset()
    // Una chiave per tentativo dell'utente: un doppio clic non compra due volte (contratto §6.2)
    setChosen({ pack, key: crypto.randomUUID() })
  }

  const confirm = () => {
    if (!chosen) return
    purchase.mutate(
      { code: chosen.pack.code, idempotencyKey: chosen.key },
      { onSuccess: (opening) => navigate(packOpeningPath(opening.openingId)) },
    )
  }

  return (
    <main className="flex flex-col gap-6 px-4 pt-[calc(var(--shell-top)+1.5rem)] pb-[calc(var(--shell-bottom)+1.5rem)] xl:h-dvh xl:min-h-[52rem] xl:px-8 xl:pt-[calc(var(--shell-top)+2.5rem)] xl:pb-8">
      <title>{`${COPY.title} · Zodiax Arena`}</title>
      <PorticoBackdrop />
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-text type-h1-m xl:type-h1">{COPY.title}</h1>
        <p className="flex items-center gap-3">
          <Coin size={36} />
          <b className="text-[1.25rem] leading-none tabular-nums">
            {shop.balance} <span className="text-text-muted type-meta-strong">{COPY.credits}</span>
          </b>
        </p>
      </header>

      {/* I pannelli sono alti quanto il contenuto (tutti uguali, decide il più alto) e la fila si
          centra tra il titolo e la banda: su schermi più alti di 900 non si allungano a vuoto */}
      <div className="flex min-h-0 flex-1 flex-col md:justify-center">
        <div className="flex flex-col gap-6 md:flex-row">
          {shop.packs.map((pack) => (
            <PackPanel
              key={pack.code}
              pack={pack}
              balance={shop.balance}
              onOpen={() => open(pack)}
            />
          ))}
        </div>
      </div>

      <TrustBand sunCounter={shop.sunCounter} />

      {chosen && (
        <PackConfirmDialog
          pack={chosen.pack}
          balance={shop.balance}
          busy={purchase.isPending}
          failed={purchase.isError}
          onConfirm={confirm}
          onClose={() => setChosen(null)}
        />
      )}
    </main>
  )
}
