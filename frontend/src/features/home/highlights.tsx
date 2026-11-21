import type { ReactNode } from 'react'
import { PATHS } from '@/app/paths'
import { CardFan } from '@/components/game/CardFan'
import { DeckValidity } from '@/components/game/DeckValidity'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Constellation } from '@/components/progress/Constellation'
import { Meridian } from '@/components/progress/Meridian'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import type { HomeSummary } from '@/features/home/types'
import type { PlayerSummary } from '@/features/player/types'
import { GOD_LABELS } from '@/domain/labels'
import { daysUntil } from '@/lib/dates'
import { plural } from '@/lib/plural'

/** Un riquadro in evidenza: tutta la superficie porta alla sua pagina. */
export interface Highlight {
  key: 'deck' | 'missions' | 'packs' | 'faction'
  to: string
  /** Immagine a sinistra (ventaglio, medaglione, meridiana). */
  visual: ReactNode
  /** Categoria in sopratitolo. */
  category: string
  title: string
  /** Riga di stato (una o due righe). */
  status: ReactNode
  /** Frase per gli screen reader: il riquadro intero è un collegamento. */
  ariaLabel: string
}

/**
 * Banda desktop (riga) o Tessere mobile (griglia 2×2): stessi contenuti, misure e testi diversi.
 * `band-narrow` è la Banda sotto i 1440 px: ventaglio più stretto, perché il nome del Cielo resti intero.
 */
export type HighlightLayout = 'band' | 'band-narrow' | 'tile'

/**
 * Prepara i quattro riquadri della Home: Il tuo Cielo, Missioni, Pacchetti, Fazione
 * (FOUNDATIONS §6c e §6b-ter). Stessa anatomia nei due formati: visuale, categoria, titolo, stato.
 * Quello che il backend non manda ancora (missioni, pacchetti, luna piena) non si inventa: il
 * riquadro resta un collegamento alla sua sezione, con "In arrivo".
 *
 * @param home Dati della Home.
 * @param player Riepilogo del giocatore (per la Fazione).
 * @param layout `band` su desktop (`band-narrow` sotto i 1440 px), `tile` su mobile.
 * @returns I quattro riquadri, in ordine.
 */
export function buildHighlights(
  home: HomeSummary,
  player: PlayerSummary,
  layout: HighlightLayout,
): Highlight[] {
  const band = layout !== 'tile'
  const fanStep = layout === 'band' ? 25 : layout === 'band-narrow' ? 18 : 11
  const medal = band ? 50 : 46
  const { deck, missions, packs, fullMoon } = home
  const { faction } = player
  const god = faction ? GOD_LABELS[faction.god] : null
  const moonDays = fullMoon && daysUntil(fullMoon.nextAt)
  const soon = <span>{SOON}</span>
  const icon = (name: IconName) => (
    <Medallion size={medal}>
      <Icon name={name} size={24} className="text-gold-bright" />
    </Medallion>
  )

  return [
    deck
      ? {
          key: 'deck',
          to: PATHS.deck,
          visual: <CardFan cards={deck.cards} cardWidth={band ? 40 : 34} step={fanStep} />,
          category: 'Il tuo Cielo',
          title: deck.name,
          ariaLabel: `Il tuo Cielo: ${deck.name}, ${deck.valid ? 'valido' : 'da correggere'}`,
          status: <DeckValidity valid={deck.valid} />,
        }
      : {
          key: 'deck',
          to: PATHS.deck,
          visual: icon('mazzo'),
          category: 'Il tuo Cielo',
          title: 'Nessun Cielo',
          ariaLabel: 'Il tuo Cielo: ancora da comporre',
          status: <span>Componi il tuo Cielo</span>,
        },
    {
      key: 'missions',
      to: PATHS.missions,
      visual: icon('missione'),
      category: 'Oggi',
      title: 'Missioni',
      ariaLabel: missions
        ? `Missioni di oggi: ${missions.done} di ${missions.total}`
        : `Missioni: ${SOON.toLowerCase()}`,
      status: missions ? (
        <>
          <Constellation progress={missions} width={band ? 52 : 46} />
          <span>
            {missions.done} di {missions.total}
          </span>
        </>
      ) : (
        soon
      ),
    },
    packs
      ? packsHighlight(packs, band, medal)
      : {
          key: 'packs',
          to: PATHS.shop,
          visual: icon('pacchetto'),
          category: 'Negozio',
          title: 'Pacchetti',
          ariaLabel: `Negozio: ${SOON.toLowerCase()}`,
          status: soon,
        },
    {
      key: 'faction',
      to: PATHS.faction,
      visual: (
        <Medallion size={medal}>
          {faction ? (
            <ElementEmblem element={faction.element} size={band ? 44 : 40} />
          ) : (
            <Icon name="fazione" size={24} className="text-gold-bright" />
          )}
        </Medallion>
      ),
      category: 'La tua Fazione',
      title: god?.name ?? 'Da scegliere',
      ariaLabel: faction
        ? `La tua Fazione: ${god?.name}, ${god?.effect}${moonDays === null ? '' : `, luna piena tra ${plural(moonDays, 'giorno', 'giorni')}`}`
        : 'La tua Fazione: da scegliere',
      status: faction ? (
        <>
          <span>{band && moonDays !== null ? `${god?.effect} ·` : god?.effect}</span>
          {moonDays !== null && (
            <span className="inline-flex items-center gap-1">
              <Icon name="luna-piena" size={14} className="text-gold-bright" />
              {band ? `tra ${moonDays} g` : `luna piena tra ${moonDays} g`}
            </span>
          )}
        </>
      ) : (
        <span>Scegli il Dio che ti guida</span>
      ),
    },
  ]
}

/** Stato dei riquadri la cui sezione non ha ancora dati dal backend. */
const SOON = 'In arrivo'

/**
 * Il riquadro del Negozio con i dati dei pacchetti.
 *
 * @param packs Pacchetti acquistabili e contatore del Sole.
 * @param band Banda desktop (una riga) o Tessera mobile (due righe).
 * @param medal Misura della meridiana.
 * @returns Il riquadro.
 */
function packsHighlight(
  packs: NonNullable<HomeSummary['packs']>,
  band: boolean,
  medal: number,
): Highlight {
  const sunWithin = packs.sunCounter.total - packs.sunCounter.done
  return {
    key: 'packs',
    to: PATHS.shop,
    visual: <Meridian progress={packs.sunCounter} size={medal} />,
    category: 'Negozio',
    title: band ? 'Apri un pacchetto' : 'Pacchetti',
    ariaLabel: `Negozio: puoi aprire ${plural(packs.affordable, 'pacchetto', 'pacchetti')}, Sole garantito entro ${plural(sunWithin, 'pacchetto', 'pacchetti')}`,
    status: band ? (
      <span>
        Puoi aprirne <b className="text-text">{packs.affordable}</b> · Sole entro{' '}
        <b className="text-tier-leggendaria-text">{sunWithin}</b>
      </span>
    ) : (
      <>
        <span>
          Puoi aprirne <b className="text-text">{packs.affordable}</b>
        </span>
        <span>
          Sole entro <b className="text-tier-leggendaria-text">{sunWithin}</b>
        </span>
      </>
    ),
  }
}
