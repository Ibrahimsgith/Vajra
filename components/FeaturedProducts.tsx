

import React from 'react';
// FIX: Removed import from non-existent constants.ts file.
import { ProductCard } from './ProductCard';
import { Product } from '../types';

interface FeaturedProductsProps {
  // FIX: Added products prop to receive data from parent.
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  // FIX: Use products from props instead of mock data.
  const featured = products.slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-[#5c1f2b]">Featured Collection</h2>
          <p className="text-gray-600 mt-2">Handpicked pieces that define elegance and style.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map(product => (
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
    </section>
  );
};