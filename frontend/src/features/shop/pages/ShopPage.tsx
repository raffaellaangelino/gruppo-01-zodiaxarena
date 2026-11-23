import { useState } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { TilePanel } from '@/components/panels/TilePanel'
import { Coin } from '@/components/ui/Coin'
import { GoldButton } from '@/components/ui/GoldButton'
import { Icon } from '@/components/ui/Icon'
import { TertiaryLink } from '@/components/ui/TertiaryButton'
import { PACKS, STAR_PROBABILITIES, type PackDefinition, type PackRarity } from '@/features/shop/packs'
import './shop.css'

const RARITY_ORDER: PackRarity[] = ['common', 'rare', 'epic', 'legendary', 'ascendant', 'star']

const RARITY_LABELS: Record<PackRarity, string> = {
  common: 'Comuni',
  rare: 'Rare',
  epic: 'Epiche',
  legendary: 'Leggendarie',
  ascendant: 'Ascendenti',
  star: 'Stella',
}

const RARITY_CLASSES: Record<PackRarity, string> = {
  common: 'shop-card-slot--common',
  rare: 'shop-card-slot--rare',
  epic: 'shop-card-slot--epic',
  legendary: 'shop-card-slot--legendary',
  ascendant: 'shop-card-slot--ascendant',
  star: 'shop-card-slot--star',
}

interface StarProbability {
  rarity: Exclude<PackRarity, 'common' | 'star'>
  label: string
  probability: number
}

export function ShopPage() {
  const [packDrafts, setPackDrafts] = useState(PACKS)
  const [selectedId, setSelectedId] = useState('zenit')
  const [probabilities, setProbabilities] = useState<StarProbability[]>(() =>
    STAR_PROBABILITIES.map((probability) => ({
      ...probability,
      probability: probability.rarity === 'ascendant' ? 8 : probability.probability,
    })),
  )
  const [saveMessage, setSaveMessage] = useState('')
  const [buyMessage, setBuyMessage] = useState('')
  const selectedPack = packDrafts.find(({ id }) => id === selectedId) ?? packDrafts[0]
  const counts = getRarityCounts(selectedPack.rarities)
  const probabilityTotal = probabilities.reduce((total, item) => total + item.probability, 0)
  const hasProbabilityError = probabilityTotal !== 100

  const updateSelectedPack = (update: (pack: PackDefinition) => PackDefinition) => {
    setPackDrafts((current) =>
      current.map((pack) => (pack.id === selectedId ? update(pack) : pack)),
    )
    setSaveMessage('')
  }

  const updateCount = (rarity: PackRarity, rawValue: string) => {
    const value = Number.parseInt(rawValue, 10)
    if (!Number.isFinite(value)) return

    updateSelectedPack((pack) => {
      const withoutRarity = pack.rarities.filter((item) => item !== rarity)
      const nextRarities = [
        ...withoutRarity,
        ...Array.from({ length: Math.max(0, Math.min(20, value)) }, () => rarity),
      ].sort((a, b) => RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b))
      return { ...pack, rarities: nextRarities }
    })
  }

  const updateProbability = (rarity: PackRarity, rawValue: string) => {
    const probability = Number.parseInt(rawValue, 10)
    if (!Number.isFinite(probability)) return

    setProbabilities((current) =>
      current.map((item) =>
        item.rarity === rarity
          ? { ...item, probability: Math.max(0, Math.min(100, probability)) }
          : item,
      ),
    )
    setSaveMessage('')
  }

  const selectPack = (id: string) => {
    setSelectedId(id)
    setSaveMessage('')
    setBuyMessage('')
  }

  return (
    <main className="shop-page">
      <title>Pacchetti · Zodiax Arena</title>
      <PorticoBackdrop />

      <div className="shop-page__inner">
        <nav className="shop-tabs" aria-label="Sezioni collezione">
          <Link to={PATHS.collection} className="shop-tabs__link">Carte</Link>
          <Link to={PATHS.deck} className="shop-tabs__link">Archivio</Link>
          <Link to={PATHS.shop} className="shop-tabs__link shop-tabs__link--active">
            Pacchetti
          </Link>
        </nav>

        <header className="shop-header">
          <div>
            <h1>Pacchetti</h1>
            <p>Struttura, probabilità della Stella e anteprima.</p>
          </div>
          <div className="shop-header__actions">
            <TertiaryLink to={PATHS.collection} size="s">
              Annulla
            </TertiaryLink>
            <GoldButton
              size="m"
              onClick={() =>
                setSaveMessage(
                  hasProbabilityError
                    ? `Le probabilità devono sommare a 100% (totale: ${probabilityTotal}%).`
                    : 'Salvataggio non disponibile offline.',
                )
              }
            >
              Salva
            </GoldButton>
          </div>
        </header>

        <div className="shop-layout">
          <TilePanel as="aside" aria-label="Elenco pacchetti" className="shop-list-panel">
            <h2>Pacchetti</h2>
            <div className="shop-pack-list">
              {packDrafts.map((pack) => (
                <button
                  type="button"
                  key={pack.id}
                  className={`shop-pack-option ${pack.id === selectedId ? 'shop-pack-option--active' : ''}`}
                  aria-pressed={pack.id === selectedId}
                  onClick={() => selectPack(pack.id)}
                >
                  <PackBadge rarity={pack.rarities[pack.rarities.length - 1] ?? 'star'} />
                  <span className="shop-pack-option__copy">
                    <strong>{pack.name}</strong>
                    <span><Coin size={13} /> {pack.price}</span>
                  </span>
                  <span className="shop-pack-option__state">Disponibile</span>
                </button>
              ))}
            </div>
          </TilePanel>

          <TilePanel as="section" aria-label={`Modifica pacchetto ${selectedPack.name}`} className="shop-editor-panel">
            <div className="shop-editor">
              <div className="shop-fields">
                <label className="shop-field shop-field--name">
                  <span>Nome</span>
                  <input
                    value={selectedPack.name}
                    onChange={(event) =>
                      updateSelectedPack((pack) => ({ ...pack, name: event.target.value }))
                    }
                  />
                </label>
                <label className="shop-field">
                  <span>Prezzo (crediti)</span>
                  <input
                    type="number"
                    min="0"
                    value={selectedPack.price}
                    onChange={(event) => {
                      const price = Number.parseInt(event.target.value, 10)
                      if (Number.isFinite(price) && price >= 0) {
                        updateSelectedPack((pack) => ({ ...pack, price }))
                      }
                    }}
                  />
                </label>
                <label className="shop-field">
                  <span>Disponibilità</span>
                  <select defaultValue="Sempre">
                    <option>Sempre</option>
                    <option>Temporanea</option>
                  </select>
                </label>
                <label className="shop-field">
                  <span>Categoria</span>
                  <select defaultValue="Generale">
                    <option>Generale</option>
                    <option>Speciale</option>
                  </select>
                </label>
              </div>

              <section className="shop-editor-section" aria-labelledby="shop-contents-title">
                <div className="shop-section-heading">
                  <h2 id="shop-contents-title">Carte nel pacchetto</h2>
                  <span>{selectedPack.rarities.length} carte</span>
                </div>
                <div className="shop-rarity-fields">
                  {RARITY_ORDER.map((rarity) => (
                    <label className="shop-rarity-field" key={rarity}>
                      <span className={`shop-rarity-label shop-rarity-label--${rarity}`}>
                        {RARITY_LABELS[rarity]}
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={counts[rarity]}
                        aria-label={`Numero di carte ${RARITY_LABELS[rarity]}`}
                        onChange={(event) => updateCount(rarity, event.target.value)}
                      />
                    </label>
                  ))}
                </div>
                <div className="shop-card-slots" aria-label="Sequenza delle carte nel pacchetto">
                  {selectedPack.rarities.map((rarity, index) => (
                    <span
                      key={`${selectedPack.id}-${rarity}-${index}`}
                      className={`shop-card-slot ${RARITY_CLASSES[rarity]}`}
                      title={`${RARITY_LABELS[rarity]} ${index + 1}`}
                    >
                      {rarity === 'star' ? <Icon name="sole" size={14} /> : index + 1}
                    </span>
                  ))}
                </div>
              </section>

              <section className="shop-editor-section shop-star-section" aria-labelledby="shop-star-title">
                <div className="shop-section-heading">
                  <h2 id="shop-star-title">Probabilità della Stella</h2>
                  <span>Ultima carta del pacchetto</span>
                </div>
                <div className="shop-probability-fields">
                  {probabilities.map(({ rarity, label, probability }) => (
                    <label className="shop-probability-field" key={rarity}>
                      <span className={`shop-rarity-label shop-rarity-label--${rarity}`}>{label}</span>
                      <span>
                        <input
                          type="number"
                          value={probability}
                          min="0"
                          max="100"
                          aria-invalid={hasProbabilityError}
                          aria-label={`${label} percentuale`}
                          onChange={(event) => updateProbability(rarity, event.target.value)}
                        />
                        <b>%</b>
                      </span>
                    </label>
                  ))}
                </div>
                <div
                  className="shop-probability-bar"
                  aria-label={probabilities.map(({ label, probability }) => `${probability}% ${label}`).join(', ')}
                >
                  {probabilities.map(({ rarity, probability }) => (
                    <span
                      key={rarity}
                      className={`shop-probability-bar__${rarity}`}
                      style={{ width: `${probability}%` }}
                    />
                  ))}
                </div>
                {hasProbabilityError && (
                  <p className="shop-probability-error" role="alert">
                    <Icon name="avviso" size={14} />
                    Le probabilità devono sommare a 100% (totale: {probabilityTotal}%).
                  </p>
                )}
              </section>

              <div className="shop-guarantee">
                <div>
                  <strong>Sole garantito entro 10 Stelle</strong>
                  <span>Avanzamento attuale: 6 su 10</span>
                </div>
                <span className="shop-guarantee__badge">{selectedPack.guarantee}</span>
              </div>
            </div>
          </TilePanel>

          <TilePanel as="aside" aria-label="Anteprima pacchetto" className="shop-preview-panel">
            <div className="shop-preview">
              <p className="shop-preview__eyebrow">Anteprima pacchetto</p>
              <PackArtwork name={selectedPack.name} />
              <p className="shop-preview__name">{selectedPack.name}</p>
              <div className="shop-preview__slots" aria-label={`${selectedPack.rarities.length} carte`}>
                {selectedPack.rarities.map((rarity, index) => (
                  <span
                    key={`preview-${selectedPack.id}-${rarity}-${index}`}
                    className={`shop-card-slot ${RARITY_CLASSES[rarity]}`}
                  />
                ))}
              </div>
              <div className="shop-preview__price">
                <Coin size={24} />
                <strong>{selectedPack.price}</strong>
                <span>crediti</span>
              </div>
              <GoldButton
                size="m"
                className="shop-preview__buy"
                onClick={() => setBuyMessage('Acquisto non disponibile offline.')}
              >
                Acquista
              </GoldButton>
              <output className="shop-preview__message" aria-live="polite">
                {buyMessage}
              </output>
              <p className="shop-preview__footnote">Le carte doppie seguono le regole del gioco.</p>
            </div>
          </TilePanel>
        </div>

        <output className="shop-save-message" aria-live="polite">{saveMessage}</output>
      </div>
    </main>
  )
}

function getRarityCounts(rarities: PackRarity[]): Record<PackRarity, number> {
  return RARITY_ORDER.reduce(
    (counts, rarity) => {
      counts[rarity] = rarities.filter((item) => item === rarity).length
      return counts
    },
    { common: 0, rare: 0, epic: 0, legendary: 0, ascendant: 0, star: 0 },
  )
}

function PackBadge({ rarity }: { rarity: PackRarity }) {
  return (
    <span className={`shop-pack-badge shop-pack-badge--${rarity}`} aria-hidden="true">
      <Icon name="pacchetto" size={20} />
    </span>
  )
}

function PackArtwork({ name }: { name: string }) {
  return (
    <div className="shop-artwork" aria-hidden="true">
      <span className="shop-artwork__orbit shop-artwork__orbit--outer" />
      <span className="shop-artwork__orbit shop-artwork__orbit--inner" />
      <span className="shop-artwork__star shop-artwork__star--top"><Icon name="luna" size={16} /></span>
      <span className="shop-artwork__star shop-artwork__star--right"><Icon name="sole" size={16} /></span>
      <span className="shop-artwork__star shop-artwork__star--bottom"><Icon name="ascendente" size={16} /></span>
      <span className="shop-artwork__star shop-artwork__star--left"><Icon name="luna-piena" size={16} /></span>
      <span className="shop-artwork__center"><Icon name="sole" size={32} /></span>
      <span className="shop-artwork__name">{name}</span>
    </div>
  )
}
