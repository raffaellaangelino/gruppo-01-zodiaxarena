import type { ReactNode } from 'react'
import { PATHS } from '@/app/paths'
import { CardFan } from '@/components/game/CardFan'
import { DeckValidity } from '@/components/game/DeckValidity'
import { ElementEmblem } from '@/components/game/ElementEmblem'
import { Constellation } from '@/components/progress/Constellation'
import { Meridian } from '@/components/progress/Meridian'
import { Icon } from '@/components/ui/Icon'
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
  const sunWithin = home.packs.sunCounter.total - home.packs.sunCounter.done
  const { faction } = player
  const god = faction ? GOD_LABELS[faction.god] : null
  const moonDays = daysUntil(home.fullMoon.nextAt)

  return [
    {
      key: 'deck',
      to: PATHS.deck,
      visual: <CardFan cards={home.deck.cards} cardWidth={band ? 40 : 34} step={fanStep} />,
      category: 'Il tuo Cielo',
      title: home.deck.name,
      ariaLabel: `Il tuo Cielo: ${home.deck.name}, ${home.deck.valid ? 'valido' : 'da correggere'}`,
      status: <DeckValidity valid={home.deck.valid} />,
    },
    {
      key: 'missions',
      to: PATHS.missions,
      visual: (
        <Medallion size={medal}>
          <Icon name="missione" size={24} className="text-gold-bright" />
        </Medallion>
      ),
      category: 'Oggi',
      title: 'Missioni',
      ariaLabel: `Missioni di oggi: ${home.missions.done} di ${home.missions.total}`,
      status: (
        <>
          <Constellation progress={home.missions} width={band ? 52 : 46} />
          <span>
            {home.missions.done} di {home.missions.total}
          </span>
        </>
      ),
    },
    {
      key: 'packs',
      to: PATHS.shop,
      visual: <Meridian progress={home.packs.sunCounter} size={medal} />,
      category: 'Negozio',
      title: band ? 'Apri un pacchetto' : 'Pacchetti',
      ariaLabel: `Negozio: puoi aprire ${plural(home.packs.affordable, 'pacchetto', 'pacchetti')}, Sole garantito entro ${plural(sunWithin, 'pacchetto', 'pacchetti')}`,
      status: band ? (
        <span>
          Puoi aprirne <b className="text-text">{home.packs.affordable}</b> · Sole entro{' '}
          <b className="text-tier-leggendaria-text">{sunWithin}</b>
        </span>
      ) : (
        <>
          <span>
            Puoi aprirne <b className="text-text">{home.packs.affordable}</b>
          </span>
          <span>
            Sole entro <b className="text-tier-leggendaria-text">{sunWithin}</b>
          </span>
        </>
      ),
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
        ? `La tua Fazione: ${god?.name}, ${god?.effect}, luna piena tra ${plural(moonDays, 'giorno', 'giorni')}`
        : 'La tua Fazione: da scegliere',
      status: faction ? (
        <>
          <span>{band ? `${god?.effect} ·` : god?.effect}</span>
          <span className="inline-flex items-center gap-1">
            <Icon name="luna-piena" size={14} className="text-gold-bright" />
            {band ? `tra ${moonDays} g` : `luna piena tra ${moonDays} g`}
          </span>
        </>
      ) : (
        <span>Scegli il Dio che ti guida</span>
      ),
    },
  ]
}
