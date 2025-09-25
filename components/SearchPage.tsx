
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { SearchIcon } from './icons/SearchIcon';

interface SearchPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

// Levenshtein distance function for fuzzy search
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) { matrix[0][i] = i; }
  for (let j = 0; j <= b.length; j++) { matrix[j][0] = j; }
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }
  return matrix[b.length][a.length];
};

export const SearchPage: React.FC<SearchPageProps> = ({ products, onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    
    return products.filter(product => {
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const productType = product.productType.toLowerCase();

      // Simple includes check for performance
      if (name.includes(lowerCaseQuery) || category.includes(lowerCaseQuery) || productType.includes(lowerCaseQuery)) {
        return true;
      }

      // Fuzzy search for typos
      const nameDistance = levenshteinDistance(lowerCaseQuery, name.substring(0, lowerCaseQuery.length));
      if (nameDistance <= 2) { // Allow up to 2 typos
        return true;
      }
      
      return false;
    }).slice(0, 5); // Limit suggestions to 5
  }, [query, products]);

  const handleSuggestionClick = (productId: number) => {
    onViewProduct(productId);
    setQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16 animate-fade-in min-h-[60vh]">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-5xl font-serif text-white text-center">Search Our Collection</h1>
          <div className="relative mt-6" ref={searchContainerRef}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search for rings, necklaces, and more..."
              className="w-full pl-5 pr-12 py-4 text-lg bg-white/5 border-2 border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-shadow text-white placeholder-white/50"
              autoFocus
            />
            <SearchIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
            
            {isFocused && query.length > 1 && (
              <div className="absolute top-full mt-2 w-full bg-[#4a1922] border border-white/10 rounded-lg shadow-lg z-10 overflow-hidden">
                {suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map(product => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleSuggestionClick(product.id)}
                          className="w-full text-left flex items-center p-3 hover:bg-white/10 transition-colors"
                        >
                          <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                          <span className="text-white">{product.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-4 text-center text-white/60">No suggestions found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
