import React from 'react';
import { ElementType } from '../../types/zodiax';
import { ELEMENTS_CONFIG } from '../../constants/gameConfig';
import { CardCategoryFilter, CollectionFiltersState } from '../../hooks/useCollection';
import './CollectionFilters.css';

interface CollectionFiltersProps {
  filters: CollectionFiltersState;
  onUpdateFilter: <K extends keyof CollectionFiltersState>(
    key: K,
    value: CollectionFiltersState[K]
  ) => void;
  onReset: () => void;
}

const ELEMENT_KEYS: ElementType[] = ['FUOCO', 'ACQUA', 'TERRA', 'ARIA'];

export const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  filters,
  onUpdateFilter,
  onReset,
}) => {
  return (
    <section className="collection-filters" aria-label="Filtri collezione">
      {/* Ricerca testuale */}
      <div className="collection-filters__group">
        <label htmlFor="card-search" className="collection-filters__label">
          Cerca carta o segno
        </label>
        <input
          id="card-search"
          type="search"
          className="collection-filters__input"
          placeholder="Es. Leone, Poseidone, Ariete..."
          value={filters.search}
          onChange={(e) => onUpdateFilter('search', e.target.value)}
        />
      </div>

      {/* Filtro Elemento / Casata */}
      <div className="collection-filters__group">
        <span className="collection-filters__label">Elemento / Casata</span>
        <div className="collection-filters__pills">
          <button
            type="button"
            className={`filter-pill ${filters.element === 'ALL' ? 'is-active' : ''}`}
            onClick={() => onUpdateFilter('element', 'ALL')}
          >
            Tutti
          </button>
          {ELEMENT_KEYS.map((el) => {
            const meta = ELEMENTS_CONFIG[el];
            const isActive = filters.element === el;
            return (
              <button
                key={el}
                type="button"
                className={`filter-pill ${isActive ? 'is-active' : ''}`}
                style={{
                  borderColor: meta.colorPrimary,
                  backgroundColor: isActive ? meta.colorPrimary : 'transparent',
                  color: isActive ? '#1A1E2E' : '#F7F4EE',
                }}
                onClick={() => onUpdateFilter('element', el)}
              >
                {meta.label} ({meta.godLabel})
              </button>
            );
          })}
        </div>
      </div>

      {/* Filtro Tipo (Creatura / Ascendente) e Scambiabilità */}
      <div className="collection-filters__row">
        <div className="collection-filters__group">
          <label htmlFor="card-category" className="collection-filters__label">
            Tipo carta
          </label>
          <select
            id="card-category"
            className="collection-filters__select"
            value={filters.category}
            onChange={(e) =>
              onUpdateFilter('category', e.target.value as CardCategoryFilter)
            }
          >
            <option value="ALL">Tutte le carte</option>
            <option value="CREATURE">Solo Creature</option>
            <option value="ASCENDANT">Solo Ascendenti</option>
          </select>
        </div>

        <label className="collection-filters__checkbox">
          <input
            type="checkbox"
            checked={filters.onlyTradeable}
            onChange={(e) => onUpdateFilter('onlyTradeable', e.target.checked)}
          />
          <span>Mostra solo carte scambiabili</span>
        </label>

        <button
          type="button"
          className="collection-filters__reset"
          onClick={onReset}
        >
          Azzera filtri
        </button>
      </div>
    </section>
  );
};