import React from 'react';
import { PlayerCard } from '../../types/zodiax';
import { ELEMENTS_CONFIG } from '../../constants/gameConfig';
import './ZodiacCard.css';

interface ZodiacCardProps {
  playerCard: PlayerCard;
  onSelect?: (card: PlayerCard) => void;
}

export const ZodiacCard: React.FC<ZodiacCardProps> = ({ playerCard, onSelect }) => {
  const { cardDefinition, isTradeable, inDeck, origin } = playerCard;
  const elementMeta = ELEMENTS_CONFIG[cardDefinition.element];

  return (
    <article
      className="zodiac-card"
      style={{
        borderColor: elementMeta.colorPrimary,
        backgroundColor: elementMeta.colorSoft,
      }}
      onClick={() => onSelect?.(playerCard)}
      tabIndex={0}
      role="button"
      aria-label={`${cardDefinition.name}, elemento ${elementMeta.label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(playerCard);
        }
      }}
    >
      {/* Intestazione Carta */}
      <header className="zodiac-card__header">
        <h3 className="zodiac-card__title">{cardDefinition.name}</h3>
        {cardDefinition.type === 'CREATURE' && cardDefinition.cost !== undefined && (
          <span className="zodiac-card__cost" title="Costo">
            {cardDefinition.cost}
          </span>
        )}
      </header>

      {/* Area Illustrazione / Costellazione */}
      <div className="zodiac-card__artwork">
        {cardDefinition.imgId ? (
          <img
            src={`/assets/cards/${cardDefinition.imgId}.png`}
            alt={cardDefinition.name}
            className="zodiac-card__img"
          />
        ) : (
          <div className="zodiac-card__placeholder">
            <span
              className="zodiac-card__sign-pill"
              style={{ borderColor: elementMeta.colorPrimary }}
            >
              {cardDefinition.sign}
            </span>
          </div>
        )}
      </div>

      {/* Sottotitolo Tipo / Dio */}
      <div className="zodiac-card__meta">
        <span className="zodiac-card__type">
          {cardDefinition.type === 'ASCENDANT'
            ? `ASCENDENTE · ${elementMeta.godLabel.toUpperCase()}`
            : `CREATURA · ${elementMeta.label.toUpperCase()}`}
        </span>
        <span className="zodiac-card__sign">{cardDefinition.sign}</span>
      </div>

      {/* Descrizione / Abilità */}
      <p className="zodiac-card__description">
        {cardDefinition.description || elementMeta.elementAbility}
      </p>

      {/* Footer: Statistiche ATK/DEF oppure stato collezione */}
      <footer className="zodiac-card__footer">
        <div className="zodiac-card__badges">
          {inDeck && <span className="zodiac-badge zodiac-badge--deck">Nel mazzo</span>}
          {(!isTradeable || origin === 'INIZIALE') && (
            <span className="zodiac-badge zodiac-badge--locked">Non scambiabile</span>
          )}
        </div>

        {cardDefinition.type === 'CREATURE' && (
          <div className="zodiac-card__stats" aria-label="Attacco e Difesa">
            <span className="zodiac-stat" title="Attacco">
              {cardDefinition.atk}
            </span>
            <span className="zodiac-stat" title="Difesa">
              {cardDefinition.def}
            </span>
          </div>
        )}
      </footer>
    </article>
  );
};