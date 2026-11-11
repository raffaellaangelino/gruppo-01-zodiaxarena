import { Logo } from '@/components/brand/Logo'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { LoadingConstellation } from '@/components/progress/LoadingConstellation'
import { InlineError } from '@/components/ui/InlineError'

/** Proprietà di {@link BootScreen}. */
export interface BootScreenProps {
  /** Se il caricamento è fallito: messaggio e "Riprova" al posto dell'attesa. */
  error?: { message: string; onRetry: () => void }
}

/**
 * Schermata di caricamento all'ingresso nel gioco, come nei client di gioco: lo sfondo delle
 * pagine interne (il portico), il logo, una costellazione che si accende. Compare solo se i dati tardano
 * (vedi `useBootPhase`) e lascia il posto alla Home già completa.
 */
export function BootScreen({ error }: BootScreenProps) {
  return (
    <div className="fixed inset-0 isolate z-50 animate-enter motion-reduce:animate-none">
      <PorticoBackdrop />

      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-4">
        <Logo height={72} />
        {error ? (
          <InlineError message={error.message} onRetry={error.onRetry} />
        ) : (
          <output className="flex flex-col items-center gap-4">
            <LoadingConstellation />
            <span className="text-text-soft text-shadow-scene type-meta">
              Le stelle si allineano…
            </span>
          </output>
        )}
      </div>
    </div>
  )
}
