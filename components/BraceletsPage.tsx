
import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface BraceletsPageProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const BraceletsPage: React.FC<BraceletsPageProps> = ({ onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const bracelets = MOCK_PRODUCTS.filter(p => p.productType === 'Bracelets');

  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white">Bracelets Collection</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">Adorn your wrist with our stunning collection of bracelets.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {bracelets.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onViewProduct={onViewProduct}
              isWishlisted={wishlistItems.includes(product.id)}
            />
          ))}
           {bracelets.length === 0 && <p className="text-center col-span-full text-white/70">No bracelets found in our collection yet.</p>}
        </div>
      </div>
    </div>
  );
};
