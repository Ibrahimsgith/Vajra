
import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface AntiquesPageProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const AntiquesPage: React.FC<AntiquesPageProps> = ({ onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const antiques = MOCK_PRODUCTS.filter(p => p.productType === 'Antiques');

  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white">Antiques Collection</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">Discover one-of-a-kind antique pieces with a rich history and timeless beauty.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {antiques.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onViewProduct={onViewProduct}
              isWishlisted={wishlistItems.includes(product.id)}
            />
          ))}
           {antiques.length === 0 && <p className="text-center col-span-full text-white/70">No antiques found in our collection yet.</p>}
        </div>
      </div>
    </div>
  );
};
