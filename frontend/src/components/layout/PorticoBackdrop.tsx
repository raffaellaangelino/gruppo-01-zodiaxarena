import porticoUrl from '@/assets/images/portico.webp'

/** Proprietà di {@link PorticoBackdrop}. */
export interface PorticoBackdropProps {
  /**
   * `reading`: velo più fitto al centro, per le pagine di testo (Guida, regolamento):
   * colonne e stendardi restano visibili ai bordi senza disturbare le righe.
   */
  variant?: 'default' | 'reading'
}

/**
 * Sfondo delle pagine interne (FOUNDATIONS §6b, rev. 10/11): il portico attorno all'arena, con
 * colonne e stendardi ai bordi, cielo scuro al centro e il pavimento con la ruota in basso.
 * Ancorato in basso al centro e velato. Niente nuvole né trono: sono della Home e delle scene.
 */
export function PorticoBackdrop({ variant = 'default' }: PorticoBackdropProps) {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-scene-base">
      <img
        src={porticoUrl}
        alt=""
        className="size-full object-cover"
        style={{ objectPosition: '50% 100%' }}
      />
      <div
        className={`absolute inset-0 ${variant === 'reading' ? 'bg-(image:--za-scene-veil-portico-reading)' : 'bg-(--za-scene-veil-portico)'}`}
      />
    </div>
  )
}
