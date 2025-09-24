
import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface SearchPageProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const SearchPage: React.FC<SearchPageProps> = ({ onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return MOCK_PRODUCTS.filter(product =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      product.category.toLowerCase().includes(lowerCaseQuery)
    );
  }, [query]);

  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16 animate-fade-in min-h-[60vh]">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-5xl font-serif text-white text-center">Search Our Collection</h1>
          <div className="relative mt-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for rings, necklaces, and more..."
              className="w-full pl-5 pr-12 py-4 text-lg bg-white/5 border-2 border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-shadow text-white placeholder-white/50"
              autoFocus
            />
            <SearchIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
          </div>
        </div>

        {query.trim() && (
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={onAddToCart} 
                    onToggleWishlist={onToggleWishlist}
                    onViewProduct={onViewProduct}
                    isWishlisted={wishlistItems.includes(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-white/70 text-lg">No results found for "{query}".</p>
                <p className="text-white/70 mt-2">Try searching for another term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};