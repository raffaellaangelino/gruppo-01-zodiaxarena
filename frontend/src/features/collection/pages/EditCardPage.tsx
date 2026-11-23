import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import marteCard from '@/assets/cards/marte.webp'
import { PorticoBackdrop } from '@/components/layout/PorticoBackdrop'
import { TilePanel } from '@/components/panels/TilePanel'
import { GoldButton } from '@/components/ui/GoldButton'
import { TertiaryLink } from '@/components/ui/TertiaryButton'
import './edit-card.css'

type ValueSource = 'printed' | 'rules'

const FIELD_OPTIONS = {
  planet: ['Sole', 'Luna', 'Marte', 'Giove', 'Saturno', 'Mercurio', 'Venere'],
  type: ['Pianeta', 'Ascendente'],
  sign: [
    'Ariete',
    'Toro',
    'Gemelli',
    'Cancro',
    'Leone',
    'Vergine',
    'Bilancia',
    'Scorpione',
    'Sagittario',
    'Capricorno',
    'Acquario',
    'Pesci',
  ],
  rarity: ['Comune', 'Rara', 'Epica', 'Leggendaria', 'Ascendente'],
  house: ['I Casa', 'II Casa', 'III Casa', 'IV Casa', 'V Casa', 'VI Casa'],
  element: ['Fuoco', 'Acqua', 'Terra', 'Aria'],
} as const

export function EditCardPage() {
  const [values, setValues] = useState({
    planet: 'Marte',
    type: 'Pianeta',
    sign: 'Ariete',
    rarity: 'Rara',
    house: 'I Casa',
    element: 'Fuoco',
    attack: '26',
    defense: '13',
    description: 'Prima colpisce. Poi chiede il nome.',
  })
  const [valueSource, setValueSource] = useState<ValueSource>('rules')
  const [showPreviewStats, setShowPreviewStats] = useState(true)
  const [saveMessage, setSaveMessage] = useState('')

  const updateValue = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setSaveMessage('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveMessage('Modifiche demo: il salvataggio non è disponibile offline.')
  }

  const activeAttack = valueSource === 'printed' ? '21' : values.attack
  const activeDefense = valueSource === 'printed' ? '10' : values.defense

  return (
    <main className="edit-card-page">
      <title>Modifica carta · Zodiax Arena</title>
      <PorticoBackdrop />

      <div className="edit-card-page__inner">
        <nav className="edit-card-tabs" aria-label="Sezioni collezione">
          <Link to={PATHS.collection} className="edit-card-tabs__link edit-card-tabs__link--active">
            Carte
          </Link>
          <Link to={PATHS.deck} className="edit-card-tabs__link">
            Archivio
          </Link>
          <Link to={PATHS.shop} className="edit-card-tabs__link">
            Pacchetti
          </Link>
        </nav>

        <header className="edit-card-header">
          <div>
            <p className="edit-card-eyebrow">Modifica carta · ID 003</p>
            <h1>{values.planet} in {values.sign}</h1>
            <p>{values.type} · Elemento: {values.element} · Rarità: {values.rarity}</p>
          </div>
          <div className="edit-card-header__actions">
            <TertiaryLink size="s" to={PATHS.collection}>
              Annulla
            </TertiaryLink>
            <GoldButton size="m" type="submit" form="edit-card-form">
              Salva
            </GoldButton>
          </div>
        </header>

        <div className="edit-card-layout">
          <form id="edit-card-form" className="edit-card-form" onSubmit={handleSubmit}>
            <TilePanel as="section" aria-label="Dati della carta" className="edit-card-panel">
              <div className="edit-card-fields">
                <EditorSelect
                  label="Pianeta"
                  value={values.planet}
                  options={FIELD_OPTIONS.planet}
                  onChange={(value) => updateValue('planet', value)}
                />
                <EditorSelect
                  label="Tipo"
                  value={values.type}
                  options={FIELD_OPTIONS.type}
                  onChange={(value) => updateValue('type', value)}
                />
                <EditorSelect
                  label="Segno"
                  value={values.sign}
                  options={FIELD_OPTIONS.sign}
                  onChange={(value) => updateValue('sign', value)}
                />
                <EditorSelect
                  label="Rarità"
                  value={values.rarity}
                  options={FIELD_OPTIONS.rarity}
                  onChange={(value) => updateValue('rarity', value)}
                />
                <EditorSelect
                  label="Casa"
                  value={values.house}
                  options={FIELD_OPTIONS.house}
                  onChange={(value) => updateValue('house', value)}
                />
                <EditorSelect
                  label="Elemento"
                  value={values.element}
                  options={FIELD_OPTIONS.element}
                  onChange={(value) => updateValue('element', value)}
                />
              </div>

              <section className="card-conflict" aria-labelledby="card-conflict-title">
                <div className="card-conflict__heading">
                  <h2 id="card-conflict-title">Valori stampati e regole</h2>
                  <span className="card-conflict__warning">Conflitto rilevato</span>
                </div>
                <div className="card-conflict__comparison">
                  <StatSet title="Valori stampati sulla carta" attack="21" defense="10" />
                  <span className="card-conflict__versus" aria-hidden="true">VS</span>
                  <StatSet title="Valori calcolati dalle regole" attack="26" defense="13" />
                </div>
                <fieldset className="card-conflict__choices">
                  <legend className="edit-card-visually-hidden">Valori da usare</legend>
                  <button
                    type="button"
                    aria-pressed={valueSource === 'printed'}
                    className={valueSource === 'printed' ? 'is-selected' : ''}
                    onClick={() => setValueSource('printed')}
                  >
                    Usa valori stampati
                  </button>
                  <button
                    type="button"
                    aria-pressed={valueSource === 'rules'}
                    className={valueSource === 'rules' ? 'is-selected' : ''}
                    onClick={() => setValueSource('rules')}
                  >
                    Usa valori da regolamento
                  </button>
                </fieldset>
              </section>

              <div className="edit-card-fields edit-card-fields--stats">
                <EditorInput
                  label="Attacco da regolamento"
                  value={values.attack}
                  type="number"
                  onChange={(value) => updateValue('attack', value)}
                />
                <EditorInput
                  label="Difesa da regolamento"
                  value={values.defense}
                  type="number"
                  onChange={(value) => updateValue('defense', value)}
                />
              </div>

              <label className="edit-card-description">
                <span>Descrizione</span>
                <textarea
                  value={values.description}
                  rows={2}
                  onChange={(event) => updateValue('description', event.target.value)}
                />
              </label>
            </TilePanel>
            <output className="edit-card-message" aria-live="polite">
              {saveMessage}
            </output>
          </form>

          <aside className="edit-card-preview" aria-label="Anteprima carta">
            <h2>Anteprima</h2>
            <div className="edit-card-preview__frame">
              <img src={marteCard} alt="Carta Marte in Ariete" />
            </div>
            <div className="edit-card-preview__summary">
              <img src={marteCard} alt="" />
              <p>
                <strong>{values.planet} in {values.sign}</strong>
                <span>{values.type} · {values.element}</span>
              </p>
            </div>
            {showPreviewStats && (
              <div className="edit-card-preview__stats" aria-live="polite">
                <span>Attacco <strong>{activeAttack}</strong></span>
                <span>Difesa <strong>{activeDefense}</strong></span>
              </div>
            )}
            <label className="edit-card-preview__toggle">
              <input
                type="checkbox"
                checked={showPreviewStats}
                onChange={(event) => setShowPreviewStats(event.target.checked)}
              />
              <span>Mostra valori stampati sulla carta</span>
            </label>
          </aside>
        </div>
      </div>
    </main>
  )
}

interface EditorSelectProps {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}

function EditorSelect({ label, value, options, onChange }: EditorSelectProps) {
  return (
    <label className="edit-card-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

interface EditorInputProps {
  label: string
  value: string
  type: 'text' | 'number'
  onChange: (value: string) => void
}

function EditorInput({ label, value, type, onChange }: EditorInputProps) {
  return (
    <label className="edit-card-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function StatSet({
  title,
  attack,
  defense,
}: {
  title: string
  attack: string
  defense: string
}) {
  return (
    <div className="card-conflict__set">
      <h3>{title}</h3>
      <div className="card-conflict__stats">
        <span><i>ATK</i>{attack}</span>
        <span><i>DEF</i>{defense}</span>
      </div>
    </div>
  )
}
