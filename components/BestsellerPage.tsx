import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface BestsellerPageProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const BestsellerPage: React.FC<BestsellerPageProps> = ({ onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const bestsellers = MOCK_PRODUCTS.filter(p => p.category === 'Bestseller');
  const [headerRef, isHeaderVisible] = useScrollAnimation();

  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16">
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-opacity duration-1000 ${isHeaderVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <h1 className="text-5xl font-serif text-white">Our Bestsellers</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">Discover our most loved and sought-after pieces, cherished by our customers for their timeless beauty and exceptional craftsmanship.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bestsellers.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onViewProduct={onViewProduct}
              isWishlisted={wishlistItems.includes(product.id)}
            />
          ))}
           {bestsellers.length === 0 && <p className="text-center col-span-full text-white/70">No bestsellers found in our collection yet.</p>}
        </div>
      </div>
    </div>
  );
};