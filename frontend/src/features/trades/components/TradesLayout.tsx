import { Outlet } from 'react-router'
import { PATHS } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { PageTabs } from '@/components/navigation/PageTabs'
import { GoldLink } from '@/components/ui/GoldButton'
import { useTrades } from '@/features/trades/queries'

export function TradesLayout() {
  const received = useTrades('RECEIVED')
  const pending = received.filter((trade) => trade.status === 'PENDING').length
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[90rem] flex-col px-4 pt-(--shell-top) pb-(--shell-bottom) xl:px-8">
      <title>Scambi · Zodiax Arena</title>
      <PorticoBackdrop />
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 pt-6 xl:pt-8">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-2">
          <h1 className="text-text type-h1-m xl:type-h1">Scambi</h1>
          <PageTabs
            label="Sezioni degli scambi"
            tabs={[
              { to: PATHS.trades, label: 'Ricevuti', count: pending },
              { to: PATHS.tradesSent, label: 'Inviati' },
            ]}
          />
        </div>
        <GoldLink to={PATHS.newTrade} className="w-50 max-sm:w-full">
          Nuovo scambio
        </GoldLink>
      </header>
      <div className="mt-6 flex-1 pb-8">
        <Outlet />
      </div>
    </main>
  )
}
