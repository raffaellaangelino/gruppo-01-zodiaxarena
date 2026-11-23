import { useState } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { LineTitle } from '@/components/ui/LineTitle'
import { usePlayerSummary } from '@/features/player/queries'
import { SettingsItem, SettingsSwitch } from '@/features/settings/components/SettingsItem'
import { SettingsDeleteDialog } from '@/features/settings/components/SettingsDeleteDialog'
import { SettingsNavigation } from '@/features/settings/components/SettingsNavigation'
import { SettingsSessionPanel } from '@/features/settings/components/SettingsSessionPanel'
import './settings.css'

type SettingsSection = 'account' | 'game' | 'privacy'

/** Preferenze account, gioco e privacy. */
export function SettingsPage() {
  const player = usePlayerSummary()
  const [activeSection, setActiveSection] = useState<SettingsSection>('account')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [profileVisible, setProfileVisible] = useState(true)
  const [message, setMessage] = useState('')
  const [sessionMessage, setSessionMessage] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  function unavailable(action: string) {
    setMessage(`${action} non è disponibile nell’anteprima offline.`)
  }

  function deleteAccount() {
    setDeleteDialogOpen(false)
    setSessionMessage('L’eliminazione dell’account non è disponibile nell’anteprima offline.')
  }

  return (
    <main className="settings-page">
      <title>Impostazioni · Zodiax Arena</title>
      <PorticoBackdrop />
      <div className="settings-page__inner">
        <header className="settings-page__header">
          <h1>Impostazioni</h1>
        </header>

        <div className="settings-layout">
          <SettingsNavigation activeSection={activeSection} onSelect={setActiveSection} />

          <div className="settings-content">
            <section id="account" className="settings-section">
              <LineTitle as="h2" textClassName="settings-section__title">
                Account
              </LineTitle>
              <div className="settings-section__items">
                <SettingsItem
                  title="Nome utente"
                  description="Il nome che vedono gli altri Custodi."
                  value={player.nickname}
                  actionLabel="Cambia"
                  onAction={() => unavailable('La modifica del nome utente')}
                />
                <SettingsItem
                  title="Email"
                  description="Indirizzo collegato al tuo account."
                  value="Non disponibile"
                  actionLabel="Cambia"
                  onAction={() => unavailable('La modifica dell’email')}
                />
                <SettingsItem
                  title="Password"
                  description="Aggiorna la password del tuo account."
                  value="••••••••"
                  actionLabel="Cambia"
                  onAction={() => unavailable('Il cambio della password')}
                />
              </div>
            </section>

            <section id="game" className="settings-section">
              <LineTitle as="h2" textClassName="settings-section__title">
                Gioco
              </LineTitle>
              <div className="settings-section__items">
                <SettingsItem
                  title="Effetti sonori"
                  description="Riproduci i suoni durante le partite."
                  control={
                    <SettingsSwitch
                      label="Attiva effetti sonori"
                      checked={soundEnabled}
                      onChange={() => setSoundEnabled((enabled) => !enabled)}
                    />
                  }
                />
                <SettingsItem
                  title="Notifiche"
                  description="Ricevi aggiornamenti sulle attività del tuo account."
                  control={
                    <SettingsSwitch
                      label="Attiva notifiche"
                      checked={notificationsEnabled}
                      onChange={() => setNotificationsEnabled((enabled) => !enabled)}
                    />
                  }
                />
              </div>
            </section>

            <section id="privacy" className="settings-section">
              <LineTitle as="h2" textClassName="settings-section__title">
                Privacy
              </LineTitle>
              <div className="settings-section__items">
                <SettingsItem
                  title="Profilo pubblico"
                  description="Consenti agli altri Custodi di vedere il tuo profilo."
                  control={
                    <SettingsSwitch
                      label="Rendi visibile il profilo"
                      checked={profileVisible}
                      onChange={() => setProfileVisible((visible) => !visible)}
                    />
                  }
                />
                <div className="settings-item settings-item--link">
                  <div className="settings-item__copy">
                    <h3>I tuoi dati</h3>
                    <p>Scopri come vengono trattate le informazioni del tuo account.</p>
                  </div>
                  <Link to={PATHS.privacy} className="settings-item__action">
                    Informativa
                  </Link>
                </div>
              </div>
            </section>
            <output className="settings-content__message" aria-live="polite">
              {message}
            </output>
          </div>

          <SettingsSessionPanel
            nickname={player.nickname}
            message={sessionMessage}
            onDelete={() => {
              setSessionMessage('')
              setDeleteDialogOpen(true)
            }}
          />
        </div>
      </div>
      {deleteDialogOpen && (
        <SettingsDeleteDialog
          nickname={player.nickname}
          onCancel={() => setDeleteDialogOpen(false)}
          onConfirm={deleteAccount}
        />
      )}
    </main>
  )
}
