import { ElementEmblem } from '@/components/game/ElementEmblem'
import { TilePanel } from '@/components/panels/TilePanel'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Medallion } from '@/components/ui/Medallion'
import { ELEMENT_LABELS, GOD_LABELS } from '@/domain/labels'
import type { Element, GodCode } from '@/domain/game'

const ELEMENT_ICONS: Record<Element, IconName> = {
  FIRE: 'fuoco',
  WATER: 'acqua',
  EARTH: 'terra',
  AIR: 'aria',
}

export interface FactionOption {
  god: GodCode
  element: Element
  image: string
  epithet: string
  description: string
}

export interface FactionCardProps {
  faction: FactionOption
  selected: boolean
  current: boolean
  onSelect: () => void
}

export function FactionCard({ faction, selected, current, onSelect }: FactionCardProps) {
  const god = GOD_LABELS[faction.god]

  return (
    <TilePanel
      as="article"
      className={`faction-card ${selected ? 'faction-card--selected' : ''}`}
    >
      <button
        type="button"
        className="faction-card__button"
        aria-label={`${god.name}, ${ELEMENT_LABELS[faction.element]}, ${god.effect}`}
        aria-pressed={selected}
        onClick={onSelect}
      >
        <span className={`faction-card__art faction-card__art--${faction.god.toLowerCase()}`}>
          <img src={faction.image} alt="" />
          <span className="faction-card__art-shade" />
          <span className="faction-card__tag">
            {current ? 'La tua Fazione' : selected ? 'Selezionata' : ELEMENT_LABELS[faction.element]}
          </span>
        </span>

        <span className="faction-card__medallion">
          <Medallion size={68}>
            <ElementEmblem element={faction.element} size={38} />
          </Medallion>
        </span>

        <span className="faction-card__body">
          <span className="faction-card__name">{god.name}</span>
          <span className="faction-card__epithet">{faction.epithet}</span>
          <span className="faction-card__description">{faction.description}</span>

          <span className="faction-card__element">
            <Icon name={ELEMENT_ICONS[faction.element]} size={16} />
            {ELEMENT_LABELS[faction.element]}
          </span>

          <span className="faction-card__bonus-label">Bonus</span>
          <span className="faction-card__effect">{god.effect}</span>
          <span className="faction-card__state">
            {current ? 'Fazione attiva' : selected ? 'Anteprima selezionata' : 'Seleziona per i dettagli'}
          </span>
        </span>
      </button>
    </TilePanel>
  )
}
