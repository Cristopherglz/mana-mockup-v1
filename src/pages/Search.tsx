import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels } from '@/types';

const popularSearches = [
  'Pan de campo',
  'Medialunas',
  'Torta de chocolate',
  'Sándwiches',
  'Sin gluten',
];

const recentSearches: string[] = [];

export function Search() {
  const navigate = useNavigate();
  const { products, setFilters } = useStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (query.length > 1) {
      const productSuggestions = products
        .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
        .map(p => p.title)
        .slice(0, 5);
      setSuggestions(productSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, products]);

  const handleSearch = (searchQuery: string) => {
    setFilters({ search: searchQuery });
    navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12 bg-mana-cream">
      <div className="container-app section-padding max-w-2xl">
        {/* Header */}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Buscar Productos
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="¿Qué estás buscando?"
            className="w-full pl-14 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl text-lg outline-none focus:border-mana-green focus:ring-4 focus:ring-mana-green/10 transition-all"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 animate-slide-up">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSearch(suggestion)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <SearchIcon className="w-5 h-5 text-gray-400" />
                <span className="flex-1">{suggestion}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}

        {/* Categories Quick Access */}
        <div className="mb-8">
          <h2 className="font-medium text-gray-500 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Categorías Populares
          </h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => navigate(`/productos?categoria=${key}`)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-mana-green hover:text-mana-green transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div>
          <h2 className="font-medium text-gray-500 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Búsquedas Populares
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => handleSearch(term)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-mana-green hover:text-mana-green transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-8">
            <h2 className="font-medium text-gray-500 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Búsquedas Recientes
            </h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:border-mana-green hover:text-mana-green transition-colors flex items-center gap-2"
                >
                  <Clock className="w-3 h-3" />
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
