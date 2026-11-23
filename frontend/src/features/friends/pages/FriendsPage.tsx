import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { TilePanel } from '@/components/panels/TilePanel'
import { GoldButton } from '@/components/ui/GoldButton'
import { LineTitle } from '@/components/ui/LineTitle'
import { Medallion } from '@/components/ui/Medallion'
import { TertiaryButton } from '@/components/ui/TertiaryButton'
import './friends.css'

export function FriendsPage() {
  const [message, setMessage] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [shareLink, setShareLink] = useState(false)

  return (
    <main className="friends-page">
      <title>Amici · Zodiax Arena</title>
      <PorticoBackdrop />

      <div className="friends-page__inner">
        <header className="friends-header">
          <h1>Profilo</h1>
          <nav className="friends-tabs" aria-label="Sezioni profilo">
            <Link to={PATHS.profile} className="friends-tabs__link">
              Il tuo profilo
            </Link>
            <span className="friends-tabs__link friends-tabs__link--active" aria-current="page">
              Amici
            </span>
          </nav>
        </header>

        <div className="friends-layout">
          <section className="friends-empty" aria-labelledby="friends-empty-title">
            <div className="friends-empty__slots" aria-hidden="true">
              <Medallion size={68} variant="avatar" className="friends-empty__leader">
                <ElementEmblem element="FIRE" size={48} />
              </Medallion>
              <Medallion size={60} variant="avatar" className="friends-empty__slot">
                <span />
              </Medallion>
              <Medallion size={60} variant="avatar" className="friends-empty__slot">
                <span />
              </Medallion>
            </div>
            <h2 id="friends-empty-title">Non hai ancora un gruppo</h2>
            <p>
              Crea un gruppo e invita i tuoi amici per affrontare insieme le sfide di Zodiax Arena.
            </p>
            <GoldButton
              size="m"
              className="friends-empty__create"
              onClick={() => setMessage('La creazione del gruppo non è disponibile offline.')}
            >
              Crea il tuo gruppo
            </GoldButton>
            <output className="friends-message" aria-live="polite">
              {message}
            </output>
          </section>

          <FriendsPanel title="Invita nel gruppo" className="friends-invite-panel">
            <p className="friends-panel__description">
              Cerca un amico per invitarlo nel tuo gruppo.
            </p>
            <form
              className="friends-invite__form"
              onSubmit={(event) => {
                event.preventDefault()
                setInviteMessage('Gli inviti non sono disponibili offline.')
              }}
            >
              <label className="friends-invite__label" htmlFor="friends-search">
                Nome utente
              </label>
              <input id="friends-search" placeholder="Cerca un amico" />
              <TertiaryButton type="submit" size="s">
                Cerca
              </TertiaryButton>
            </form>
            <label className="friends-share-link">
              <input
                type="checkbox"
                checked={shareLink}
                onChange={(event) => setShareLink(event.target.checked)}
              />
              <span>Condividi il link del gruppo</span>
            </label>
            <output className="friends-invite-panel__message" aria-live="polite">
              {inviteMessage}
            </output>
          </FriendsPanel>
        </div>
      </div>
    </main>
  )
}

function FriendsPanel({
  title,
  className = '',
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <TilePanel as="section" aria-label={title} className={`friends-panel ${className}`}>
      <div className="friends-panel__content">
        <LineTitle as="h2" textClassName="friends-panel__title">
          {title}
        </LineTitle>
        {children}
      </div>
    </TilePanel>
  )
}
