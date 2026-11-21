import { useId, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router'
import { PATHS } from '@/app/paths'
import { Logo } from '@/components/brand/Logo'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { FormAlert } from '@/components/ui/FormAlert'
import { GoldButton } from '@/components/ui/GoldButton'
import type { GodCode } from '@/domain/game'
import { ELEMENT_WITH_ARTICLE, GOD_LABELS, GOD_REALMS, SIGN_IN } from '@/domain/labels'
import { ELEMENT_GOD, GODS, SIGN_ELEMENT } from '@/domain/rules'
import { GodCard } from '@/features/onboarding/components/GodCard'
import { useChooseFaction } from '@/features/onboarding/hooks/useChooseFaction'
import { FACTION_FAILURE_MESSAGES } from '@/features/onboarding/messages'
import { usePlayerSummary } from '@/features/player/queries'

/**
 * Primi passi · Scegli il tuo Dio (S16, tavola Benvenuto-Fazione): a schermo intero, senza barra,
 * il logo in alto e le quattro Fazioni. Ermes propone il Dio dell'elemento del segno, già scelto;
 * il giocatore può prenderne un altro. La scelta si salva con "Scegli {Dio}", poi la Home.
 *
 * Rispetto alla tavola manca l'indicatore dei cinque passi con Ermes: il backend per ora ha solo
 * questo passo, e un percorso a cinque tappe che dopo la prima porta alla Home confonderebbe.
 * Torna quando arrivano gli altri passi.
 */
export function FactionPage() {
  const player = usePlayerSummary()
  const element = SIGN_ELEMENT[player.sign]
  const proposed = ELEMENT_GOD[element]
  const [selected, setSelected] = useState<GodCode>(proposed)
  const { choose, saving, failure } = useChooseFaction()
  const titleId = useId()
  const groupName = useId()

  if (player.onboarding.currentStep !== 'FACTION') return <Navigate to={PATHS.home} replace />

  const { name: proposedName } = GOD_LABELS[proposed]

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!saving) choose(selected)
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-4 pt-6 pb-safe md:px-8">
      <title>Scegli il tuo Dio · Zodiax Arena</title>
      <PorticoBackdrop />
      <Logo height={44} />

      <header className="mt-10 flex max-w-3xl flex-col items-center gap-2 text-center md:mt-16">
        <h1 id={titleId} className="text-text text-shadow-scene type-h1-m md:type-h1">
          Scegli il tuo Dio
        </h1>
        <p className="text-text-soft italic text-shadow-scene type-body">
          «Il tuo Sole è {SIGN_IN[player.sign]}: {ELEMENT_WITH_ARTICLE[element]} ti appartiene.{' '}
          {proposedName} ti aspetta {GOD_REALMS[proposed].realmAt}, ma la scelta è tua.»{' '}
          <span className="text-text-muted not-italic">· Ermes</span>
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="mt-8 flex w-full flex-1 flex-col">
        <fieldset
          aria-labelledby={titleId}
          className="mx-auto grid w-full max-w-[86rem] grid-cols-1 gap-6 pt-2.5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {GODS.map((god) => (
            <GodCard
              key={god}
              god={god}
              name={groupName}
              selected={selected === god}
              proposed={proposed === god}
              disabled={saving}
              onSelect={() => setSelected(god)}
            />
          ))}
        </fieldset>

        <div className="sticky bottom-0 -mx-4 mt-8 flex flex-col items-center gap-3 border-t border-line-soft bg-scene-base/95 px-4 py-4 backdrop-blur-glass md:static md:mx-0 md:border-0 md:bg-transparent md:py-6 md:backdrop-blur-none">
          {failure && <FormAlert>{FACTION_FAILURE_MESSAGES[failure]}</FormAlert>}
          <div className="flex flex-col-reverse items-center gap-3 md:flex-row">
            <p className="text-text-muted type-meta">Potrai cambiarla a ogni luna piena.</p>
            <GoldButton type="submit" busy={saving} className="w-58">
              {saving ? 'Un momento…' : `Scegli ${GOD_LABELS[selected].name}`}
            </GoldButton>
          </div>
        </div>
      </form>
    </main>
  )
}
