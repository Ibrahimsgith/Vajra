
import React from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface CollectionsPageProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-16 animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-amber-900">All Collections</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Browse through the entire Vajra collection. Each piece is crafted with passion, precision, and the finest materials to create jewelry that lasts a lifetime.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map(product => (
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
      </div>
    </div>
  );
};
