import { Navigate, Outlet } from 'react-router'
import { PATHS } from '@/app/paths'
import { usePlayerSummary } from '@/features/player/queries'

/**
 * Prima di entrare nel gioco, il giocatore nuovo sceglie la Fazione: senza, nessun mazzo ha
 * il suo Dio (V1). Finché il passo `FACTION` è aperto, ogni pagina interna porta alla scelta;
 * dopo, si passa. Va dentro `BootGate`, che ha già caricato il riepilogo del giocatore.
 *
 * Gli altri passi con Ermes (primo cielo, pacchetti, Cielo, prima sfida) arriveranno con le
 * loro pagine: il backend per ora conosce solo questo.
 */
export function OnboardingGate() {
  const player = usePlayerSummary()
  if (player.onboarding.currentStep === 'FACTION') {
    return <Navigate to={PATHS.welcomeFaction} replace />
  }
  return <Outlet />
}
