import moireUrl from '@/assets/images/moire.webp'
import { Icon } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import { LANDING_COPY } from '@/features/landing/messages'

const COPY = LANDING_COPY.match

/**
 * I tre passi come una costellazione (FOUNDATIONS §6b-bis): ogni passo è una stella, il filo d'oro
 * le collega e si traccia quando la sezione entra in vista, le stelle si accendono una dopo l'altra.
 * In orizzontale da tablet, in verticale su telefono.
 */
export function MatchSteps() {
  const visuals = [
    <Icon key="cielo" name="mazzo" size={24} className="text-gold-bright" />,
    <Icon key="sfida" name="sfide" size={24} className="text-gold-bright" />,
    <img key="moire" src={moireUrl} alt="" className="size-full rounded-full object-cover" />,
  ]
  return (
    <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
      <span
        aria-hidden="true"
        className="landing-thread absolute top-7 bottom-7 left-7 w-px bg-[linear-gradient(180deg,var(--za-gold)_0%,var(--za-gold-bright)_50%,var(--za-gold)_100%)] md:top-7 md:right-[16.66%] md:bottom-auto md:left-[16.66%] md:h-px md:w-auto md:bg-[linear-gradient(90deg,var(--za-gold)_0%,var(--za-gold-bright)_50%,var(--za-gold)_100%)]"
      />
      {COPY.steps.map((step, i) => (
        <li
          key={step.title}
          className="relative flex gap-5 md:flex-col md:items-center md:text-center"
        >
          <span className="landing-star relative shrink-0" style={{ ['--i' as string]: i }}>
            <Medallion size={56} variant={i === 2 ? 'large' : 'medallion'}>
              {visuals[i]}
            </Medallion>
          </span>
          <div className="flex flex-col gap-2 pt-1 md:max-w-[18rem] md:pt-0">
            <p className="type-label text-gold">{['I', 'II', 'III'][i]}</p>
            <h3 className="type-h3 text-text uppercase">{step.title}</h3>
            <p className="text-text-soft type-meta">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
