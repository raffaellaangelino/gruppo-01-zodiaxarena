import keyartUrl from '@/assets/images/keyart-home.webp'

/** Proprietà di {@link HomeBackdrop}. */
export interface HomeBackdropProps {
  /** Desktop: key art a tutto schermo. Mobile: ritagliata sul trono in alto (560 px). */
  desktop: boolean
}

/**
 * Sfondo della Home: la key art del Trono Vuoto (D-021) con il velo che rende leggibile la scena.
 * Cambia solo con espansioni e grandi aggiornamenti.
 */
export function HomeBackdrop({ desktop }: HomeBackdropProps) {
  return desktop ? (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden">
      <img
        src={keyartUrl}
        alt=""
        fetchPriority="high"
        className="size-full object-cover"
        style={{ objectPosition: '50% 30%' }}
      />
      <div className="absolute inset-0 bg-(image:--za-scene-veil-home)" />
    </div>
  ) : (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-140 overflow-hidden">
      <img
        src={keyartUrl}
        alt=""
        fetchPriority="high"
        className="h-135 w-full object-cover"
        style={{ objectPosition: '50% 0' }}
      />
      <div className="absolute inset-0 bg-(image:--za-scene-veil-home-m)" />
    </div>
  )
}
