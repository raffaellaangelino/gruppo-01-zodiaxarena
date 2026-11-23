export type PackRarity = 'common' | 'rare' | 'epic' | 'legendary' | 'ascendant' | 'star'

export interface PackDefinition {
  id: string
  name: string
  price: number
  rarities: PackRarity[]
  summary: string
  guarantee: string
}

export const PACKS: PackDefinition[] = [
  {
    id: 'costellazione',
    name: 'Costellazione',
    price: 100,
    rarities: ['common', 'common', 'common', 'rare', 'star'],
    summary: '3 Comuni · 1 Rara · 1 Stella',
    guarantee: '—',
  },
  {
    id: 'zenit',
    name: 'Zenit',
    price: 300,
    rarities: [
      'common',
      'common',
      'common',
      'common',
      'common',
      'common',
      'rare',
      'rare',
      'epic',
      'star',
    ],
    summary: '6 Comuni · 2 Rare · 1 Epica · 1 Stella',
    guarantee: '1 Epica garantita',
  },
  {
    id: 'luna-piena',
    name: 'Luna Piena',
    price: 600,
    rarities: ['common', 'common', 'common', 'rare', 'rare', 'rare', 'epic', 'ascendant', 'star'],
    summary: '3 Comuni · 3 Rare · 1 Epica · 1 Ascendente · 1 Stella',
    guarantee: '1 Ascendente garantito',
  },
]

export const STAR_PROBABILITIES = [
  { rarity: 'rare', label: 'Rara', probability: 60 },
  { rarity: 'epic', label: 'Epica', probability: 30 },
  { rarity: 'legendary', label: 'Leggendaria', probability: 8 },
  { rarity: 'ascendant', label: 'Ascendente', probability: 2 },
] as const
