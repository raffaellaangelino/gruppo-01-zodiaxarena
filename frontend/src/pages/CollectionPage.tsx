import React, { useState } from 'react';
import { useCollection } from '../hooks/useCollection';
import { PlayerCard } from '../types/zodiax';
import { ELEMENTS_CONFIG } from '../constants/gameConfig';
import { ZodiacCard } from '../components/cards/ZodiacCard';
import { CollectionFilters } from '../components/collection/CollectionFilters';
import './CollectionPage.css';

export const CollectionPage: React.FC = () => {
  const {
    cards,
    allCardsCount,
    stats,
    filters,
    updateFilter,
    resetFilters,
    loading,
    error,
    reload,
  } = useCollection();

  const [selectedCard, setSelectedCard] = useState<PlayerCard | null>(null);

  return (
    <main className="collection-page">
      <div className="collection-page__container">
        {/* Intestazione con cornice dorata */}
        <header className="collection-page__header">
          <div>
            <span className="collection-page__eyebrow">ZODIAXARENA · ARCHIVIO</span>
            <h1 className="collection-page__title">La Tua Collezione</h1>
            <p className="collection-page__subtitle">
              Esplora le tue Creature e i tuoi Ascendenti, verifica le carte inserite nel mazzo
              e controlla quali sono disponibili per gli scambi.
            </p>
          </div>

          <div className="collection-page__stats" aria-label="Riepilogo collezione">
            <div className="stat-box">
              <span className="stat-box__value">{stats.total}</span>
              <span className="stat-box__label">Totali</span>
            </div>
            <div className="stat-box">
              <span className="stat-box__value">{stats.creatures}</span>
              <span className="stat-box__label">Creature</span>
            </div>
            <div className="stat-box">
              <span className="stat-box__value">{stats.ascendants}</span>
              <span className="stat-box__label">Ascendenti</span>
            </div>
            <div className="stat-box">
              <span className="stat-box__value">{stats.tradeable}</span>
              <span className="stat-box__label">Scambiabili</span>
            </div>
          </div>
        </header>

        {/* Filtri */}
        <CollectionFilters
          filters={filters}
          onUpdateFilter={updateFilter}
          onReset={resetFilters}
        />

        {/* Stati di caricamento / errore / lista vuota */}
        {loading && (
          <div className="collection-state" role="status">
            <p>Consultazione delle stelle in corso...</p>
          </div>
        )}

        {!loading && error && (
          <div className="collection-state collection-state--error" role="alert">
            <p>{error}</p>
            <button type="button" className="btn-primary" onClick={reload}>
              Riprova
            </button>
          </div>
        )}

        {!loading && !error && allCardsCount === 0 && (
          <div className="collection-state">
            <h2>La tua collezione è ancora vuota</h2>
            <p>
              Riscatta il tuo mazzo iniziale o apri un pacchetto nel Negozio per ottenere
              le prime carte.
            </p>
          </div>
        )}

        {!loading && !error && allCardsCount > 0 && cards.length === 0 && (
          <div className="collection-state">
            <h2>Nessuna carta trovata</h2>
            <p>Nessuna carta corrisponde ai filtri selezionati.</p>
            <button type="button" className="btn-primary" onClick={resetFilters}>
              Mostra tutte le carte
            </button>
          </div>
        )}

        {/* Griglia Carte */}
        {!loading && !error && cards.length > 0 && (
          <section className="collection-grid" aria-label="Elenco carte possedute">
            {cards.map((playerCard) => (
              <ZodiacCard
                key={playerCard.id}
                playerCard={playerCard}
                onSelect={setSelectedCard}
              />
            ))}
          </section>
        )}

        {/* Dialogo Dettaglio Carta */}
        {selectedCard && (
          <div
            className="card-modal-backdrop"
            onClick={() => setSelectedCard(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-card-title"
          >
            <div
              className="card-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="modal-card-title" className="card-modal__title">
                {selectedCard.cardDefinition.name}
              </h2>
              <p className="card-modal__detail">
                <strong>Elemento:</strong>{' '}
                {ELEMENTS_CONFIG[selectedCard.cardDefinition.element].label} (
                {ELEMENTS_CONFIG[selectedCard.cardDefinition.element].godLabel})
              </p>
              <p className="card-modal__detail">
                <strong>Segno Zodiacale:</strong> {selectedCard.cardDefinition.sign}
              </p>
              <p className="card-modal__detail">
                <strong>Origine:</strong> {selectedCard.origin}
              </p>
              <p className="card-modal__detail">
                <strong>Stato Scambio:</strong>{' '}
                {selectedCard.inDeck
                  ? 'Non scambiabile (attualmente nel mazzo)'
                  : selectedCard.isTradeable
                  ? 'Disponibile per lo scambio'
                  : 'Non scambiabile (carta iniziale)'}
              </p>
              <p className="card-modal__ability">
                <strong>Abilità elemento:</strong>{' '}
                {ELEMENTS_CONFIG[selectedCard.cardDefinition.element].elementAbility}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setSelectedCard(null)}
              >
                Chiudi
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};