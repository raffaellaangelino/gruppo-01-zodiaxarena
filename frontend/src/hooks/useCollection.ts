import { useState, useEffect, useMemo, useCallback } from 'react';
import { ElementType, PlayerCard } from '../types/zodiax';
import { zodiaxApi } from '../services/api';

export type CardCategoryFilter = 'ALL' | 'CREATURE' | 'ASCENDANT';

export interface CollectionFiltersState {
  search: string;
  element: ElementType | 'ALL';
  category: CardCategoryFilter;
  onlyTradeable: boolean;
}

export function useCollection() {
  const [cards, setCards] = useState<PlayerCard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<CollectionFiltersState>({
    search: '',
    element: 'ALL',
    category: 'ALL',
    onlyTradeable: false,
  });

  const fetchCollection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await zodiaxApi.getCollection();
      setCards(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Impossibile caricare la collezione dal server.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const filteredCards = useMemo(() => {
    return cards.filter((playerCard) => {
      const def = playerCard.cardDefinition;

      // Filtro per elemento
      if (filters.element !== 'ALL' && def.element !== filters.element) {
        return false;
      }

      // Filtro per categoria (Creatura vs Ascendente)
      if (filters.category !== 'ALL' && def.type !== filters.category) {
        return false;
      }

      // Filtro solo carte scambiabili (esclude mazzo iniziale e carte nel deck)
      if (filters.onlyTradeable && (!playerCard.isTradeable || playerCard.inDeck)) {
        return false;
      }

      // Ricerca testuale su nome o segno zodiacale
      if (filters.search.trim() !== '') {
        const query = filters.search.toLowerCase();
        const matchName = def.name.toLowerCase().includes(query);
        const matchSign = def.sign.toLowerCase().includes(query);
        if (!matchName && !matchSign) {
          return false;
        }
      }

      return true;
    });
  }, [cards, filters]);

  const stats = useMemo(() => {
    const total = cards.length;
    const creatures = cards.filter((c) => c.cardDefinition.type === 'CREATURE').length;
    const ascendants = cards.filter((c) => c.cardDefinition.type === 'ASCENDANT').length;
    const tradeable = cards.filter((c) => c.isTradeable && !c.inDeck).length;
    return { total, creatures, ascendants, tradeable };
  }, [cards]);

  const updateFilter = <K extends keyof CollectionFiltersState>(
    key: K,
    value: CollectionFiltersState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      element: 'ALL',
      category: 'ALL',
      onlyTradeable: false,
    });
  };

  return {
    cards: filteredCards,
    allCardsCount: cards.length,
    stats,
    filters,
    updateFilter,
    resetFilters,
    loading,
    error,
    reload: fetchCollection,
  };
}