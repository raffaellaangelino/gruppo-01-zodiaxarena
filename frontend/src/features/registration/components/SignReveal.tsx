import { CardFan } from '@/components/game/CardFan'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { faceDownCards } from '@/components/game/cardBack'
import { SignMedallion } from '@/components/game/SignMedallion'
import { Coin } from '@/components/ui/Coin'
import { ELEMENT_LABELS, GOD_LABELS, GOD_REALMS, SIGN_LABELS } from '@/domain/labels'
import { plural } from '@/lib/plural'
import type { RegistrationPreview } from '@/features/registration/types'

/** Proprietà di {@link SignReveal}. */
export interface SignRevealProps {
  preview: RegistrationPreview
  /**
   * `scene`: al centro della scena, sopra la key art (tavole Registrati-Segno e -Conferma).
   * `compact`: una riga nella colonna, per mobile, dove la scena non c'è.
   */
  variant: 'scene' | 'compact'
}

/**
 * Il gancio della registrazione: dal giorno di nascita appaiono il segno, la Fazione proposta
 * e il primo cielo (regolamento v2 §Benvenuto). Compare con una dissolvenza quando il backend
 * ha calcolato il segno, e si riaccende se la data cambia.
 *
 * Le carte del primo cielo sono coperte: 6 su 7 si sorteggiano alla registrazione, quindi qui
 * si dice solo quante sono (contratto API §2.1); si scoprono dopo, con Ermes. Il numero di carte
 * e di Ascendenti arriva dal backend, così il testo resta vero anche se il benvenuto cambia.
 */
export function SignReveal({ preview, variant }: SignRevealProps) {
  const { sign, element, proposedGod, credits, creatureCards, ascendants } = preview
  const title = `Sole in ${SIGN_LABELS[sign]}`
  const god = GOD_LABELS[proposedGod].name
  const realm = GOD_REALMS[proposedGod].realm
  /** "Efesto, la Fucina": l'articolo minuscolo dentro la frase. */
  const godWithRealm = `${god}, ${realm.charAt(0).toLowerCase()}${realm.slice(1)}`
  const cards = plural(creatureCards, 'carta', 'carte')
  const ascendantsText = ascendants > 0 ? plural(ascendants, 'Ascendente', 'Ascendenti') : null

  if (variant === 'compact') {
    return (
      <div
        key={sign}
        className="flex animate-enter items-center gap-4 py-3 motion-reduce:animate-none"
      >
        <SignMedallion sign={sign} size="m" />
        <p className="flex flex-col gap-0.5">
          <span className="type-h3 text-text">{title}</span>
          <span className="text-text-muted type-meta">
            {ELEMENT_LABELS[element]} · ti proponiamo {god} · riceverai {cards}
            {ascendantsText && `, ${ascendantsText}`} e {credits} crediti
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className="relative size-full">
      <div aria-hidden="true" className="absolute inset-0 bg-(image:--za-scene-veil-reveal)" />
      <section
        key={sign}
        aria-label="Il tuo segno"
        className="relative flex size-full animate-enter flex-col items-center justify-center gap-5 text-center text-shadow-scene motion-reduce:animate-none"
      >
        <SignMedallion sign={sign} size="l" />
        <p className="type-eyebrow tracking-[0.12em] text-gold uppercase">Il tuo segno</p>
        <h2 className="type-display text-text">{title}</h2>
        <p className="flex items-center gap-2 text-text-soft type-body">
          <ElementEmblem element={element} size={24} />
          {ELEMENT_LABELS[element]} · ti proponiamo
          <strong className="font-extrabold text-text">{godWithRealm}</strong>
        </p>
        <div className="mt-3">
          <CardFan
            cards={faceDownCards(creatureCards + ascendants)}
            cardWidth={86}
            step={46}
            tilt={4}
          />
        </div>
        <p className="flex items-center gap-2 text-text type-body">
          <span>
            Il tuo primo cielo: <strong className="font-extrabold">{cards}</strong>
            {ascendantsText && (
              <>
                {' '}
                e <strong className="font-extrabold">{ascendantsText}</strong>
              </>
            )}
          </span>
          ·
          <Coin size={22} />
          <strong className="font-extrabold">{credits} crediti</strong>
        </p>
      </section>
    </div>
  )
}
