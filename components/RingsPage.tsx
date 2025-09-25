
import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface RingsPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const RingsPage: React.FC<RingsPageProps> = ({ products, onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const rings = products.filter(p => p.productType === 'Rings');
  const [headerRef, isHeaderVisible] = useScrollAnimation();

  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16">
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-opacity duration-1000 ${isHeaderVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <h1 className="text-5xl font-serif text-white">Rings Collection</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">Explore our exquisite collection of handcrafted rings, perfect for every occasion. From dazzling solitaires to timeless wedding bands, find the piece that tells your story.</p>
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
           {rings.length === 0 && <p className="text-center col-span-full text-white/70">No rings found in our collection yet.</p>}
        </div>
      </div>
    </div>
  );
};
