import { useEffect, useRef, type ReactNode } from 'react'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import './Dialog.css'

/** Proprietà di {@link Dialog}. */
export interface DialogProps {
  /** Nome della finestra per gli screen reader (di solito è anche il suo titolo visibile). */
  label: string
  /** Chiamata quando il giocatore chiude: Esc o la X. */
  onClose: () => void
  children: ReactNode
  /** Larghezza massima (predefinita 67.5rem, la finestra di Nuova sfida). */
  className?: string
}

/**
 * Finestra modale del design system (COMPONENTS, Finestra; tavola Sfide-Nuova): una Tessera in
 * vetro sopra il velo, con la X nel medaglione in alto a destra. È un `<dialog>` nativo aperto
 * con `showModal()`: il browser tiene il focus dentro, chiude con Esc e rende inerte la pagina sotto.
 * Su mobile occupa tutto lo schermo.
 */
export function Dialog({ label, onClose, children, className = 'max-w-[67.5rem]' }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      className={`dialog w-full ${className}`}
    >
      <TilePanel as="div" className="dialog__panel">
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="absolute top-4 right-4 z-10 rounded-full xl:top-5 xl:right-5"
        >
          <Medallion size={36}>
            <Icon name="chiudi" size={16} className="text-gold-bright" />
          </Medallion>
        </button>
        <div className="dialog__body">{children}</div>
      </TilePanel>
    </dialog>
  )
}
