import type { HomeLayoutProps } from '@/features/home/components/HomeDesktop'
import { DashboardGrid } from '@/features/home/components/DashboardGrid'

/**
 * Home mobile (FOUNDATIONS §6b-ter): la pagina scorre, ma la scena e "Nuova sfida" stanno nel
 * primo schermo. Sotto: "Ti aspettano", poi le quattro Tessere.
 */
export function HomeMobile({ dashboard }: HomeLayoutProps) {
  return (
    <div className="relative mx-auto w-full px-4 pt-(--shell-top) pb-[calc(var(--shell-bottom)+var(--za-space-4))]">
      <header className="pt-6">
        <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Area utente</p>
        <h1 className="mt-2 text-text type-h1-m">Dashboard</h1>
      </header>
      <div className="mt-5">
        <DashboardGrid dashboard={dashboard} />
      </div>
    </div>
  )
}
