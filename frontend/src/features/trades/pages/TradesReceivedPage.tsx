import { useState } from 'react'
import { Dialog } from '@/components/overlay/Dialog'
import { GoldButton } from '@/components/ui/GoldButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { PlayerAvatar } from '@/components/game/PlayerAvatar'
import { useCatalog } from '@/features/cards/queries'
import { TradeCardStrip } from '@/features/trades/components/TradeCardStrip'
import { useTrades } from '@/features/trades/queries'
import type { Trade } from '@/features/trades/types'
import { daysUntil, shortDateLabel } from '@/lib/dates'
import { plural } from '@/lib/plural'
import type { CardDefinition } from '@/features/cards/types'

export function TradesReceivedPage() {
  const trades = useTrades('RECEIVED')
  const { byId } = useCatalog()
  const [answered, setAnswered] = useState<number | null>(null)
  const open = trades.find((trade) => trade.id === answered)

  if (trades.length === 0) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-text type-h2">Nessuno scambio ricevuto</h2>
        <p className="max-w-md text-text-muted type-body">
          Quando un giocatore ti propone uno scambio, lo troverai qui.
        </p>
      </section>
    )
  }

  const cardList = (ids: number[]) =>
    ids.map((id) => byId.get(id)).filter((card): card is NonNullable<typeof card> => !!card)

  return (
    <>
      <section aria-label="Scambi ricevuti" className="grid gap-5">
        {trades.map((trade) => (
          <article
            key={trade.id}
            className="glass relative grid gap-5 rounded-lg p-5 md:grid-cols-[12.5rem_minmax(0,1fr)_12.5rem] md:items-center xl:p-6"
          >
            <header className="flex items-center gap-3 md:flex-col md:text-center">
              <PlayerAvatar player={trade.player} size={64} />
              <div>
                <p className="text-text-muted type-eyebrow tracking-[0.1em] uppercase">
                  Scambio ricevuto
                </p>
                <h2 className="text-text type-h2-m">{trade.player.nickname}</h2>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4">
              <TradeCardStrip cards={cardList(trade.offeredCardIds)} label="Ricevi" />
              <TradeCardStrip cards={cardList(trade.requestedCardIds)} label="Dai" />
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-center text-text-muted type-meta">
                Ricevuto {shortDateLabel(trade.createdAt)}
                {trade.expiresAt &&
                  ` · scade tra ${plural(daysUntil(trade.expiresAt), 'giorno', 'giorni')}`}
              </p>
              <GoldButton onClick={() => setAnswered(trade.id)} className="w-full">
                Rispondi
              </GoldButton>
            </div>
          </article>
        ))}
      </section>

      {open && (
        <Dialog label={`Scambio con ${open.player.nickname}`} onClose={() => setAnswered(null)}>
          <TradeResponse trade={open} byId={byId} onClose={() => setAnswered(null)} />
        </Dialog>
      )}
    </>
  )
}

function TradeResponse({
  trade,
  byId,
  onClose,
}: {
  trade: Trade
  byId: ReadonlyMap<number, CardDefinition>
  onClose: () => void
}) {
  const offered = trade.offeredCardIds.map((id) => byId.get(id)).filter(Boolean)
  const requested = trade.requestedCardIds.map((id) => byId.get(id)).filter(Boolean)
  return (
    <div className="flex flex-col gap-6 px-5 py-8 md:px-10">
      <h2 className="text-text type-h1-m">Rispondi allo scambio</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <TradeCardStrip cards={offered.filter((card): card is CardDefinition => !!card)} label="Ricevi" />
        <TradeCardStrip cards={requested.filter((card): card is CardDefinition => !!card)} label="Dai" />
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <SecondaryButton onClick={onClose}>Rifiuta</SecondaryButton>
        <GoldButton onClick={onClose}>Accetta lo scambio</GoldButton>
      </div>
    </div>
  )
}
