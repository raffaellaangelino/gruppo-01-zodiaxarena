import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import marte from '@/assets/cards/marte.webp'
import luna from '@/assets/cards/luna.webp'
import sole from '@/assets/cards/sole.webp'
import mercurio from '@/assets/cards/mercurio.webp'
import { PATHS } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon } from '@/components/ui/Icon'
import { GoldButton } from '@/components/ui/GoldButton'
import { Medallion } from '@/components/ui/Medallion'
import { TertiaryLink } from '@/components/ui/TertiaryButton'
import { USE_MOCKS } from '@/config/env'
import { ELEMENT_LABELS, GOD_LABELS } from '@/domain/labels'
import type { GodCode } from '@/domain/game'
import { FactionCard, type FactionOption } from '@/features/player/components/FactionCard'
import { playerSummaryQuery, usePlayerSummary } from '@/features/player/queries'
import './faction.css'

const FACTIONS: readonly FactionOption[] = [
  {
    god: 'EFESTO',
    element: 'FIRE',
    image: marte,
    epithet: 'Il Forgiatore',
    description: 'La fiamma plasma creature pronte a lottare.',
  },
  {
    god: 'POSEIDONE',
    element: 'WATER',
    image: luna,
    epithet: 'Signore dei Mari',
    description: 'Le correnti proteggono chi sa attendere.',
  },
  {
    god: 'DEMETRA',
    element: 'EARTH',
    image: sole,
    epithet: 'Madre della Terra',
    description: 'La natura sostiene chi combatte con pazienza.',
  },
  {
    god: 'ERA',
    element: 'AIR',
    image: mercurio,
    epithet: 'Regina degli Dei',
    description: 'Il cielo porta equilibrio e strategia.',
  },
]

export function FactionPage() {
  const player = usePlayerSummary()
  const queryClient = useQueryClient()
  const [selectedGod, setSelectedGod] = useState<GodCode>(player.faction?.god ?? 'EFESTO')
  const [isWindowOpen, setIsWindowOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const selectedFaction = FACTIONS.find((faction) => faction.god === selectedGod) ?? FACTIONS[0]
  const selectedGodDetails = GOD_LABELS[selectedFaction.god]

  useEffect(() => {
    if (!isWindowOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsWindowOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isWindowOpen])

  function confirmFaction() {
    if (!USE_MOCKS) {
      setFeedback('Il cambio di Fazione non è disponibile con il servizio di gioco attuale.')
      return
    }

    queryClient.setQueryData(playerSummaryQuery.queryKey, {
      ...player,
      faction: { god: selectedFaction.god, element: selectedFaction.element },
    })
    setFeedback(`${selectedGodDetails.name} è ora la tua Fazione in questa anteprima.`)
  }

  return (
    <main className="faction-page">
      <title>La tua Fazione · Zodiax Arena</title>
      <PorticoBackdrop />

      <div className="faction-page__inner">
        <header className="faction-page__header">
          <div>
            <h1>Fazione</h1>
            <p className="faction-page__intro">
              <Icon name="luna-piena" size={16} />
              Potrai cambiare Fazione alla prossima Luna piena, tra 17 giorni.
            </p>
          </div>
          <p className="faction-page__hint">
            La Fazione influenza le creature del suo Elemento.
          </p>
        </header>

        <section className="faction-grid" aria-label="Scegli una Fazione">
          {FACTIONS.map((faction) => (
            <FactionCard
              key={faction.god}
              faction={faction}
              current={player.faction?.god === faction.god}
              selected={selectedGod === faction.god}
              onSelect={() => {
                setSelectedGod(faction.god)
                setFeedback('')
                setIsWindowOpen(true)
              }}
            />
          ))}
        </section>

        {isWindowOpen && (
          <TilePanel as="section" className="faction-summary" aria-label="Riepilogo della Fazione">
            <div className="faction-summary__content">
              <div className="faction-summary__emblem">
                <Medallion size={44}>
                  <ElementEmblem element={selectedFaction.element} size={26} />
                </Medallion>
              </div>
              <div className="faction-summary__copy">
                <p className="faction-summary__eyebrow">
                  {player.faction?.god === selectedFaction.god
                    ? 'La tua Fazione'
                    : 'Fazione selezionata'}
                </p>
                <h2>{selectedGodDetails.name}</h2>
                <p className="faction-summary__effect">
                  {selectedGodDetails.effect} · {ELEMENT_LABELS[selectedFaction.element]}
                </p>
                <p className="faction-summary__feedback" aria-live="polite">
                  {feedback || 'Il bonus si applica alle creature del tuo Cielo.'}
                </p>
              </div>

              <div className="faction-summary__actions">
                <TertiaryLink to={PATHS.guide} icon="aiuto" size="s">
                  Scopri gli effetti
                </TertiaryLink>
                <GoldButton size="m" onClick={confirmFaction}>
                  Scegli {selectedGodDetails.name}
                </GoldButton>
              </div>
              <button
                type="button"
                className="faction-summary__close"
                aria-label="Chiudi dettagli della Fazione"
                onClick={() => setIsWindowOpen(false)}
              >
                <Icon name="chiudi" size={16} />
              </button>
            </div>
          </TilePanel>
        )}
      </div>
    </main>
  )
}
