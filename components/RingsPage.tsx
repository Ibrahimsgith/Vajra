
import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface RingsPageProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const RingsPage: React.FC<RingsPageProps> = ({ onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const rings = MOCK_PRODUCTS.filter(p => p.category === 'Rings');

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-amber-900">Rings Collection</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Explore our exquisite collection of handcrafted rings, perfect for every occasion. From dazzling solitaires to timeless wedding bands, find the piece that tells your story.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {rings.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onViewProduct={onViewProduct}
              isWishlisted={wishlistItems.includes(product.id)}
            />
          ))}
           {rings.length === 0 && <p className="text-center col-span-full text-gray-500">No rings found in our collection yet.</p>}
        </div>
      </div>
    </div>
  );
};
