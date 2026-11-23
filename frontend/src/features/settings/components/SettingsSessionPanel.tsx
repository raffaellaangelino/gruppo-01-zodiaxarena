import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { LineTitle } from '@/components/ui/LineTitle'
import { LogoutButton } from '@/features/auth/components/LogoutButton'

interface SettingsSessionPanelProps {
  nickname: string
  message: string
  onDelete: () => void
}

/** Azioni della sessione e dell’account. */
export function SettingsSessionPanel({
  nickname,
  message,
  onDelete,
}: SettingsSessionPanelProps) {
  return (
    <TilePanel as="aside" aria-label="Sessione" className="settings-session">
      <div className="settings-session__content">
        <LineTitle as="h2" textClassName="settings-session__title">
          Sessione
        </LineTitle>
        <p className="settings-session__description">
          Hai effettuato l’accesso come <strong>{nickname}</strong>. La sessione è attiva su questo
          dispositivo.
        </p>
        <LogoutButton />
        <button type="button" className="settings-session__delete" onClick={onDelete}>
          <Icon name="elimina" size={14} />
          Elimina account
        </button>
        <output className="settings-session__message" aria-live="polite">
          {message}
        </output>
      </div>
    </TilePanel>
  )
}
