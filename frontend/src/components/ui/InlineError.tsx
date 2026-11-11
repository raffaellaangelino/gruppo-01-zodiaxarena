import { FormAlert } from '@/components/ui/FormAlert'
import { TertiaryButton } from '@/components/ui/TertiaryButton'

/** Proprietà di {@link InlineError}. */
export interface InlineErrorProps {
  /** Cosa non è andato e cosa fare. */
  message: string
  /** Riprova l'operazione. */
  onRetry: () => void
}

/** Errore di caricamento, con "Riprova" sotto il messaggio, centrati. */
export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="max-w-lg">
        <FormAlert>{message}</FormAlert>
      </div>
      <TertiaryButton icon="ricicla" onClick={onRetry}>
        Riprova
      </TertiaryButton>
    </div>
  )
}
