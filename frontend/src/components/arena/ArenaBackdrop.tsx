import arenaUrl from '@/assets/images/arena.webp'

/**
 * Sfondo dell'arena (key art Flow `flow-keyart-arena-03`, D-025): l'anfiteatro con la ruota sul
 * pavimento e le due pozze di luce dove stanno i giocatori. Dietro l'attesa, il Verdetto e il
 * Rotolo. Fisso a tutto schermo, appena velato.
 */
/** Proprietà di {@link ArenaBackdrop}. */
export interface ArenaBackdropProps {
  /** Raggiera di luce dal trono (Verdetto, vittoria). */
  glow?: boolean
}

export function ArenaBackdrop({ glow = false }: ArenaBackdropProps) {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-scene-base">
      <img src={arenaUrl} alt="" fetchPriority="high" className="size-full object-cover" />
      <div className="absolute inset-0 bg-(--za-arena-veil)" />
      {glow && <div className="absolute inset-0 bg-(image:--za-arena-glow)" />}
    </div>
  )
}
