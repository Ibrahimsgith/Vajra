import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface NecklacesPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const NecklacesPage: React.FC<NecklacesPageProps> = ({ products, onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const necklaces = products.filter(p => p.productType === 'Chains');

  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white">Necklaces Collection</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">Discover stunning necklaces that add a touch of sophistication to any look. From delicate pendants to bold statement pieces, each design is a work of art.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {necklaces.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onToggleWishlist={onToggleWishlist}
              onViewProduct={onViewProduct}
              isWishlisted={wishlistItems.includes(product.id)}
            />
          ))}
          {necklaces.length === 0 && <p className="text-center col-span-full text-white/70">No necklaces found in our collection yet.</p>}
        </div>
      </div>
    </div>
  );
};
