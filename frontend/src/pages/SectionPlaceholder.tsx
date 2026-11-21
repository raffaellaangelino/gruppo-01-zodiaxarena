import type { ReactNode } from 'react'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'

/** Proprietà di {@link SectionPlaceholder}. */
export interface SectionPlaceholderProps {
  /** Nome della sezione (es. "Collezione"). */
  title: string
  /** Azioni già disponibili nella sezione (es. "Esci" nel Profilo). */
  children?: ReactNode
}

/**
 * Sezione non ancora costruita: tiene il posto nella navigazione finché arriva la sua issue,
 * così barra e collegamenti funzionano già tutti.
 */
export function SectionPlaceholder({ title, children }: SectionPlaceholderProps) {
  return (
    <main className="grid min-h-dvh place-content-center gap-3 px-4 pt-(--shell-top) pb-(--shell-bottom) text-center">
      <title>{`${title} · Zodiax Arena`}</title>
      <PorticoBackdrop />
      <h1 className="text-gold-bright type-h1-m xl:type-h1">{title}</h1>
      <p className="text-text-muted">Questa sezione arriva con la sua issue.</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </main>
  )
}
