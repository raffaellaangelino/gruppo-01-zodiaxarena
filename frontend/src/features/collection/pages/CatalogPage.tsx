import { useState } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import ascendente from '@/assets/cards/ascendente.webp'
import giove from '@/assets/cards/giove.webp'
import luna from '@/assets/cards/luna.webp'
import marte from '@/assets/cards/marte.webp'
import mercurio from '@/assets/cards/mercurio.webp'
import saturno from '@/assets/cards/saturno.webp'
import sole from '@/assets/cards/sole.webp'
import venere from '@/assets/cards/venere.webp'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { TilePanel } from '@/components/panels/TilePanel'
import { GoldButton } from '@/components/ui/GoldButton'
import { ELEMENT_LABELS } from '@/domain/labels'
import type { Element, PlanetCode, Tier } from '@/domain/game'
import './catalog.css'

interface CatalogCard {
  id: string
  name: string
  planet: PlanetCode
  element: Element
  rarity: Tier
  type: string
  attack: number
  defense: number
  ability: string
  collection: string
  image: string
}

const TIER_LABELS: Record<Tier, string> = {
  COMMON: 'Comune',
  RARE: 'Rara',
  EPIC: 'Epica',
  LEGENDARY: 'Leggendaria',
  ASCENDANT: 'Ascendente',
}

const CATALOG_CARDS: CatalogCard[] = [
  {
    id: '001',
    name: 'Sole in Leone',
    planet: 'SOLE',
    element: 'FIRE',
    rarity: 'LEGENDARY',
    type: 'Pianeta',
    attack: 28,
    defense: 16,
    ability: 'Raggio del Sole',
    collection: 'Completa',
    image: sole,
  },
  {
    id: '002',
    name: 'Luna in Pesci',
    planet: 'LUNA',
    element: 'WATER',
    rarity: 'EPIC',
    type: 'Pianeta',
    attack: 14,
    defense: 27,
    ability: 'Marea lunare',
    collection: 'Completa',
    image: luna,
  },
  {
    id: '003',
    name: 'Marte in Ariete',
    planet: 'MARTE',
    element: 'FIRE',
    rarity: 'RARE',
    type: 'Pianeta',
    attack: 26,
    defense: 13,
    ability: 'Impeto ardente',
    collection: 'Completa',
    image: marte,
  },
  {
    id: '004',
    name: 'Venere in Toro',
    planet: 'VENERE',
    element: 'EARTH',
    rarity: 'LEGENDARY',
    type: 'Pianeta',
    attack: 18,
    defense: 25,
    ability: 'Giardino fiorito',
    collection: 'Completa',
    image: venere,
  },
  {
    id: '005',
    name: 'Giove in Sagittario',
    planet: 'GIOVE',
    element: 'FIRE',
    rarity: 'EPIC',
    type: 'Pianeta',
    attack: 24,
    defense: 20,
    ability: 'Espansione',
    collection: 'Completa',
    image: giove,
  },
  {
    id: '006',
    name: 'Saturno in Capricorno',
    planet: 'SATURNO',
    element: 'EARTH',
    rarity: 'RARE',
    type: 'Pianeta',
    attack: 17,
    defense: 28,
    ability: 'Anello del tempo',
    collection: 'Completa',
    image: saturno,
  },
  {
    id: '007',
    name: 'Mercurio in Scorpione',
    planet: 'MERCURIO',
    element: 'WATER',
    rarity: 'COMMON',
    type: 'Pianeta',
    attack: 19,
    defense: 18,
    ability: 'Pensiero rapido',
    collection: 'Completa',
    image: mercurio,
  },
  {
    id: '008',
    name: 'Ascendente in Sagittario',
    planet: 'SOLE',
    element: 'AIR',
    rarity: 'ASCENDANT',
    type: 'Ascendente',
    attack: 30,
    defense: 30,
    ability: 'Nuovo orizzonte',
    collection: 'Completa',
    image: ascendente,
  },
  {
    id: '009',
    name: 'Luna in Cancro',
    planet: 'LUNA',
    element: 'WATER',
    rarity: 'EPIC',
    type: 'Pianeta',
    attack: 16,
    defense: 25,
    ability: 'Rifugio silenzioso',
    collection: 'Completa',
    image: luna,
  },
  {
    id: '010',
    name: 'Sole in Bilancia',
    planet: 'SOLE',
    element: 'AIR',
    rarity: 'RARE',
    type: 'Pianeta',
    attack: 21,
    defense: 21,
    ability: 'Equilibrio',
    collection: 'Completa',
    image: sole,
  },
  {
    id: '011',
    name: 'Venere in Bilancia',
    planet: 'VENERE',
    element: 'AIR',
    rarity: 'EPIC',
    type: 'Pianeta',
    attack: 20,
    defense: 23,
    ability: 'Armonia celeste',
    collection: 'Completa',
    image: venere,
  },
  {
    id: '012',
    name: 'Marte in Scorpione',
    planet: 'MARTE',
    element: 'WATER',
    rarity: 'LEGENDARY',
    type: 'Pianeta',
    attack: 29,
    defense: 17,
    ability: 'Furia nascosta',
    collection: 'Completa',
    image: marte,
  },
  {
    id: '013',
    name: 'Ascendente in Leone',
    planet: 'SOLE',
    element: 'FIRE',
    rarity: 'ASCENDANT',
    type: 'Ascendente',
    attack: 30,
    defense: 27,
    ability: 'Cuore di fuoco',
    collection: 'Completa',
    image: ascendente,
  },
]

const PLANETS: PlanetCode[] = [
  'SOLE',
  'LUNA',
  'MARTE',
  'GIOVE',
  'SATURNO',
  'MERCURIO',
  'VENERE',
]
const TIERS: Tier[] = ['COMMON', 'RARE', 'EPIC', 'LEGENDARY', 'ASCENDANT']
const ELEMENTS: Element[] = ['FIRE', 'WATER', 'EARTH', 'AIR']

export function CatalogPage() {
  const [query, setQuery] = useState('')
  const [planet, setPlanet] = useState('')
  const [rarity, setRarity] = useState('')
  const [element, setElement] = useState('')
  const [message, setMessage] = useState('')

  const filteredCards = CATALOG_CARDS.filter((card) => {
    const matchesQuery =
      !query ||
      `${card.name} ${card.ability} ${card.planet}`.toLowerCase().includes(query.toLowerCase())
    return (
      matchesQuery &&
      (!planet || card.planet === planet) &&
      (!rarity || card.rarity === rarity) &&
      (!element || card.element === element)
    )
  })

  return (
    <main className="catalog-page">
      <title>Catalogo · Zodiax Arena</title>
      <PorticoBackdrop />

      <div className="catalog-page__inner">
        <nav className="catalog-tabs" aria-label="Sezioni collezione">
          <Link to={PATHS.collection} className="catalog-tabs__link catalog-tabs__link--active">
            Carte
          </Link>
          <Link to={PATHS.deck} className="catalog-tabs__link">
            Archivio
          </Link>
          <Link to={PATHS.shop} className="catalog-tabs__link">
            Pacchetti
          </Link>
        </nav>

        <header className="catalog-header">
          <div>
            <h1>Catalogo</h1>
            <p>Catalogo di tutte le carte di Zodiax Arena.</p>
          </div>
          <div className="catalog-header__actions">
            <GoldButton
              size="m"
              className="catalog-header__action"
              onClick={() => setMessage('Il potenziamento delle carte non è disponibile offline.')}
            >
              Migliora carta
            </GoldButton>
            <output className="catalog-message" aria-live="polite">
              {message}
            </output>
          </div>
        </header>

        <section className="catalog-tools" aria-label="Ricerca e filtri carte">
          <label className="catalog-search">
            <span className="catalog-visually-hidden">Cerca carte</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca carte per nome..."
            />
          </label>
          <label className="catalog-filter">
            <span className="catalog-visually-hidden">Pianeta</span>
            <select value={planet} onChange={(event) => setPlanet(event.target.value)}>
              <option value="">Pianeta</option>
              {PLANETS.map((value) => (
                <option key={value} value={value}>
                  {value.charAt(0) + value.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-filter">
            <span className="catalog-visually-hidden">Rarità</span>
            <select value={rarity} onChange={(event) => setRarity(event.target.value)}>
              <option value="">Rarità</option>
              {TIERS.map((value) => (
                <option key={value} value={value}>
                  {TIER_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="catalog-filter">
            <span className="catalog-visually-hidden">Elemento</span>
            <select value={element} onChange={(event) => setElement(event.target.value)}>
              <option value="">Elemento</option>
              {ELEMENTS.map((value) => (
                <option key={value} value={value}>
                  {ELEMENT_LABELS[value]}
                </option>
              ))}
            </select>
          </label>
          <span className="catalog-count">
            {query || planet || rarity || element ? filteredCards.length : 124} carte
          </span>
        </section>

        <TilePanel as="section" aria-label="Catalogo delle carte" className="catalog-table-panel">
          <div className="catalog-table-scroll">
            <table className="catalog-table">
              <caption className="catalog-visually-hidden">Carte disponibili nel catalogo</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Carta</th>
                  <th scope="col">Elemento</th>
                  <th scope="col">Rarità</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Stats</th>
                  <th scope="col">Abilità</th>
                  <th scope="col">Collezione</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card) => (
                  <tr key={card.id}>
                    <td className="catalog-table__id">{card.id}</td>
                    <th scope="row" aria-label={card.name} className="catalog-table__card">
                      <div className="catalog-card-name">
                        <img src={card.image} alt="" loading="lazy" />
                        {card.id === '003' ? (
                          <Link to={PATHS.editCard}>{card.name}</Link>
                        ) : (
                          <span>{card.name}</span>
                        )}
                      </div>
                    </th>
                    <td>
                      <span className={`catalog-element catalog-element--${card.element.toLowerCase()}`}>
                        {ELEMENT_LABELS[card.element]}
                      </span>
                    </td>
                    <td>
                      <span className={`catalog-rarity catalog-rarity--${card.rarity.toLowerCase()}`}>
                        {TIER_LABELS[card.rarity]}
                      </span>
                    </td>
                    <td>{card.type}</td>
                    <td>
                      <div className="catalog-stats" aria-label={`Attacco ${card.attack}, difesa ${card.defense}`}>
                        <span className="catalog-stats__attack">{card.attack}</span>
                        <span className="catalog-stats__defense">{card.defense}</span>
                      </div>
                    </td>
                    <td className="catalog-table__ability">{card.ability}</td>
                    <td className="catalog-table__complete">{card.collection}</td>
                  </tr>
                ))}
                {filteredCards.length === 0 && (
                  <tr>
                    <td colSpan={8} className="catalog-table__empty">
                      Nessuna carta trovata con questi filtri.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TilePanel>

      </div>
    </main>
  )
}
