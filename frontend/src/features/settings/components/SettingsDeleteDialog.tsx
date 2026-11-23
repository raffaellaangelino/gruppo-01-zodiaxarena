import { useEffect, useRef, useState } from 'react'
import { TilePanel } from '@/components/panels/TilePanel'
import { TertiaryButton } from '@/components/ui/TertiaryButton'

interface SettingsDeleteDialogProps {
  nickname: string
  onCancel: () => void
  onConfirm: () => void
}

/** Conferma visiva dell'eliminazione account, senza eseguire operazioni offline. */
export function SettingsDeleteDialog({
  nickname,
  onCancel,
  onConfirm,
}: SettingsDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [confirmation, setConfirmation] = useState('')
  const canConfirm = confirmation === nickname

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()

    return () => {
      if (dialog?.open) dialog.close()
    }
  }, [])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (canConfirm) onConfirm()
  }

  return (
    <dialog
      ref={dialogRef}
      className="settings-delete-dialog"
      aria-labelledby="settings-delete-title"
      aria-describedby="settings-delete-description"
      onCancel={(event) => {
        event.preventDefault()
        onCancel()
      }}
    >
      <form onSubmit={handleSubmit}>
        <TilePanel as="div" className="settings-delete-dialog__panel">
          <div className="settings-delete-dialog__content">
            <h2 id="settings-delete-title" className="settings-delete-dialog__title">
              Eliminare l’account?
            </h2>
            <p id="settings-delete-description" className="settings-delete-dialog__description">
              Perderai per sempre il tuo account e tutti i suoi dati. Questa operazione non può
              essere annullata. Per confermare, scrivi il tuo nome utente.
            </p>
            <label className="settings-delete-dialog__label" htmlFor="settings-delete-confirmation">
              Nome utente
            </label>
            <input
              autoFocus
              id="settings-delete-confirmation"
              className="settings-delete-dialog__input"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={nickname}
              autoComplete="off"
            />
            <div className="settings-delete-dialog__actions">
              <TertiaryButton
                type="button"
                size="s"
                className="settings-delete-dialog__cancel"
                onClick={onCancel}
              >
                Annulla
              </TertiaryButton>
              <TertiaryButton
                type="submit"
                size="s"
                className="settings-delete-dialog__confirm"
                disabled={!canConfirm}
              >
                Elimina per sempre
              </TertiaryButton>
            </div>
          </div>
        </TilePanel>
      </form>
    </dialog>
  )
}
