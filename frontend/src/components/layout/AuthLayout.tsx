import type { ReactNode } from 'react'
import keyartUrl from '@/assets/images/keyart-home.webp'
import { Logo } from '@/components/brand/Logo'
import { GoldClasp } from '@/components/ornaments/GoldClasp'

/** Inquadratura della key art dietro la colonna (tavola Accedi: 70% 30%). */
const KEYART_POSITION = '70% 30%'

/** Proprietà di {@link AuthLayout}. */
export interface AuthLayoutProps {
  /** Contenuto della colonna, centrato in verticale sotto il logo. */
  children: ReactNode
}

/**
 * Impaginazione di accesso e registrazione (FOUNDATIONS §6b-decies, tavole Accedi e Registrati):
 * la key art del Trono a tutto schermo, velata a sinistra, e una sola colonna laterale
 * in vetro con il logo al centro in alto. Il bordo destro della colonna è la barra di gioco
 * "girata": doppio filo d'oro con il fermaglio a metà altezza.
 *
 * Su mobile (tavola non ancora disegnata) la colonna occupa tutta la larghezza e il bordo sparisce.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-dvh bg-scene-base">
      <img
        src={keyartUrl}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="fixed inset-0 size-full object-cover"
        style={{ objectPosition: KEYART_POSITION }}
      />
      <div aria-hidden="true" className="fixed inset-0 bg-(image:--za-scene-veil-auth)" />

      <div className="relative flex min-h-dvh w-full flex-col bg-(image:--za-column-fill) px-4 py-10 backdrop-blur-glass md:w-(--za-column-w) md:px-14">
        <Logo height={52} className="self-center" />
        <div className="flex flex-1 flex-col justify-center py-10">{children}</div>

        <div aria-hidden="true" className="hidden md:block">
          <span className="absolute inset-y-0 -right-px w-0.5 bg-(image:--za-edge-gold)" />
          <span className="absolute inset-y-0 right-1.5 w-px bg-edge-thin" />
          <GoldClasp className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  )
}
