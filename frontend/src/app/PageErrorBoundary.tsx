import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { InlineError } from '@/components/ui/InlineError'

/** Messaggio quando una pagina non riesce a caricare i suoi dati. */
const PAGE_ERROR = 'Questa pagina non si è caricata. Riprova tra poco.'

/** Proprietà di {@link PageErrorBoundary}. */
export interface PageErrorBoundaryProps {
  children: ReactNode
}

/**
 * Se una pagina non riesce a caricare i dati, mostra l'errore con "Riprova" al posto della
 * pagina, lasciando le barre del gioco. "Riprova" ripete le richieste fallite.
 */
export function PageErrorBoundary({ children }: PageErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => <Boundary onReset={reset}>{children}</Boundary>}
    </QueryErrorResetBoundary>
  )
}

/** Proprietà di {@link Boundary}. */
interface BoundaryProps {
  onReset: () => void
  children: ReactNode
}

/** Limite d'errore di React (esiste solo come classe). */
class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Errore nella pagina', error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    const retry = () => {
      this.props.onReset()
      this.setState({ failed: false })
    }
    return (
      <div className="grid min-h-dvh place-content-center px-4 pt-(--shell-top) pb-(--shell-bottom)">
        <PorticoBackdrop />
        <InlineError message={PAGE_ERROR} onRetry={retry} />
      </div>
    )
  }
}
