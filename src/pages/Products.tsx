import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, Plus, Check } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels, type Category } from '@/types';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filteredProducts, products, categories, filters, setFilters, addToCart } = useStore();
  
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
    (searchParams.get('categoria') as Category) || undefined
  );
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const categoryFromUrl = searchParams.get('categoria') as Category;
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setFilters({ ...filters, category: categoryFromUrl });
    }
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters({ ...filters, search: searchQuery || undefined });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleCategoryChange = (category: Category | undefined) => {
    setSelectedCategory(category);
    setFilters({ ...filters, category });
    if (category) {
      setSearchParams({ categoria: category });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setFilters({});
    setSearchParams({});
  };

  const handleAddToCart = useCallback((e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (addedProducts.has(product.id)) return;
    addToCart(product);
    setAddedProducts(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedProducts(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1800);
  }, [addToCart, addedProducts]);

  const hasActiveFilters = searchQuery || selectedCategory || filters.sortBy;

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12">
      <div className="container-app section-padding">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
            Nuestros Productos
          </h1>
          <p className="text-gray-600 mt-2">
            Descubre nuestra selección de productos artesanales
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-mana-green focus:ring-2 focus:ring-mana-green/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-mana-green text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-mana-green'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-mana-burgundy text-white text-xs rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          <div className="relative">
            <select
              value={filters.sortBy || ''}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="appearance-none w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-mana-green focus:ring-2 focus:ring-mana-green/20 transition-all cursor-pointer pr-12"
            >
              <option value="">Ordenar por</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
              <option value="newest">Más Recientes</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-6 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-mana-green hover:text-mana-burgundy transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="form-label">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange(undefined)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      !selectedCategory
                        ? 'bg-mana-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-mana-green text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Contenido de Gluten</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, hasGluten: undefined })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.hasGluten === undefined
                        ? 'bg-mana-green text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, hasGluten: false })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.hasGluten === false
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Sin Gluten
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, hasGluten: true })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.hasGluten === true
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Con Gluten
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Rango de Precio</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-24 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-mana-green"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-24 px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-mana-green"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-mana-green/10 text-mana-green rounded-full text-sm">
                {categoryLabels[selectedCategory]}
                <button onClick={() => handleCategoryChange(undefined)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-mana-green/10 text-mana-green rounded-full text-sm">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.hasGluten !== undefined && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                filters.hasGluten ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                {filters.hasGluten ? 'Con Gluten' : 'Sin Gluten'}
                <button onClick={() => setFilters({ ...filters, hasGluten: undefined })}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-6">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isAdded = addedProducts.has(product.id);
              return (
                <Link
                  key={product.id}
                  to={`/producto/${product.id}`}
                  className="product-card-3d bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {!product.hasGluten && (
                      <span className="absolute top-3 left-3 gluten-free-badge">
                        Sin Gluten
                      </span>
                    )}
                    {product.hasGluten && (
                      <span className="absolute top-3 left-3 contains-gluten-badge">
                        Con Gluten
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="text-xs text-mana-green font-medium uppercase tracking-wider">
                      {categoryLabels[product.category]}
                    </span>
                    <h3 className="font-heading font-semibold text-sm sm:text-base text-gray-900 mt-1 truncate">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="price-tag text-base">
                        ${product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isAdded
                            ? 'bg-mana-green text-white scale-110'
                            : 'bg-mana-green text-white hover:bg-mana-green-dark'
                        }`}
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4 animate-scale-in" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 mb-6">
              Intenta con otros términos de búsqueda o filtros
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
