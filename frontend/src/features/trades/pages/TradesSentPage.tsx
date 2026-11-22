import { PlayerAvatar } from '@/components/game/PlayerAvatar'
import { Pill } from '@/components/ui/Pill'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { useCatalog } from '@/features/cards/queries'
import { TradeCardStrip } from '@/features/trades/components/TradeCardStrip'
import { useTrades } from '@/features/trades/queries'
import { shortDateLabel } from '@/lib/dates'
import type { CardDefinition } from '@/features/cards/types'

export function TradesSentPage() {
  const trades = useTrades('SENT')
  const { byId } = useCatalog()

  if (trades.length === 0) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-text type-h2">Non hai scambi inviati</h2>
        <p className="max-w-md text-text-muted type-body">
          Le proposte che invii restano qui fino a una risposta.
        </p>
      </section>
    )
  }

  return (
    <section aria-label="Scambi inviati" className="grid gap-4">
      {trades.map((trade) => {
        const offered = trade.offeredCardIds.map((id) => byId.get(id)).filter(Boolean)
        const requested = trade.requestedCardIds.map((id) => byId.get(id)).filter(Boolean)
        return (
          <article key={trade.id} className="glass grid gap-4 rounded-lg p-5 md:grid-cols-[14rem_1fr_10rem] md:items-center">
            <header className="flex items-center gap-3">
              <PlayerAvatar player={trade.player} size={56} />
              <div>
                <p className="text-text-muted type-meta">A {trade.player.nickname}</p>
                <Pill tone={trade.status === 'PENDING' ? 'gold' : 'muted'}>
                  {trade.status === 'PENDING' ? 'In attesa' : 'Rifiutato'}
                </Pill>
              </div>
            </header>
            <div className="grid grid-cols-2 gap-3">
              <TradeCardStrip cards={offered.filter((card): card is CardDefinition => !!card)} label="Offri" />
              <TradeCardStrip cards={requested.filter((card): card is CardDefinition => !!card)} label="Richiedi" />
            </div>
            <div className="flex flex-col items-end gap-3">
              <p className="text-text-muted type-meta">{shortDateLabel(trade.createdAt)}</p>
              {trade.status === 'PENDING' && (
                <SecondaryButton>Ritira</SecondaryButton>
              )}
            </div>
          </article>
        )
      })}
    </section>
  )
}
