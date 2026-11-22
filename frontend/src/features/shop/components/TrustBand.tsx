import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { BandPanel } from '@/components/panels/BandPanel'
import { Meridian } from '@/components/progress/Meridian'
import { Icon } from '@/components/ui/Icon'
import { Spark } from '@/components/ui/Spark'
import type { Progress } from '@/domain/game'
import { SHOP_COPY } from '@/features/shop/messages'

const COPY = SHOP_COPY.band

/**
 * Banda della trasparenza (tavola Negozio, gen_ng.trust_band): il contatore del Sole (la stessa
 * meridiana della Home), la protezione dai doppioni e le probabilità della Stella con il
 * collegamento a tutte le probabilità (FAQ della Guida).
 */
export function TrustBand({ sunCounter }: { sunCounter: Progress }) {
  const left = sunCounter.total - sunCounter.done
  const [before, n, after] = COPY.sun(left)
  return (
    <BandPanel aria-label="Garanzie e probabilità" className="xl:h-26">
      <div className="flex h-full flex-col divide-y divide-line-soft xl:flex-row xl:items-center xl:divide-x xl:divide-y-0">
        <Cell visual={<Meridian progress={sunCounter} size={56} />}>
          <b className="type-body-strong">
            {before} <span className="text-tier-leggendaria-text">{n}</span> {after}
          </b>
          <span className="text-text-muted type-meta">{COPY.sunNote}</span>
        </Cell>
        <Cell visual={<Icon name="doppione" size={32} className="text-gold-bright" />}>
          <b className="type-body-strong">{COPY.noDuplicates}</b>
          <span className="text-text-muted type-meta">{COPY.noDuplicatesNote}</span>
        </Cell>
        <Cell visual={<Spark size={24} />}>
          <b className="type-body-strong">{COPY.star}</b>
          <span className="text-text-muted type-meta">
            {COPY.starNote}{' '}
            <Link to={PATHS.guide} className="font-bold text-gold-bright no-underline">
              {COPY.allOdds}
            </Link>
          </span>
        </Cell>
      </div>
    </BandPanel>
  )
}

/** Una cella della banda: segno a sinistra, titolo e nota. */
function Cell({ visual, children }: { visual: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center gap-4 px-6 py-4 xl:py-0">
      <span aria-hidden="true" className="flex w-14 shrink-0 justify-center">
        {visual}
      </span>
      <span className="flex flex-col gap-1">{children}</span>
    </div>
  )
}
