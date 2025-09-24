
import React from 'react';
import { ProductCard } from './ProductCard';
import { Product, Page } from '../types';

interface WishlistPageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ products, onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  return (
    <div className="bg-[#5c1f2b]">
      <div className="container mx-auto px-6 py-16 animate-fade-in min-h-[60vh]">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-white">Your Wishlist</h1>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">Your collection of cherished pieces. Add them to your cart when you're ready.</p>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
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
            <p className="text-white/70 text-lg mb-4">Your wishlist is currently empty.</p>
            <p className="text-white/70">Explore our collections to find something you love!</p>
          </div>
        )}
      </div>
    </div>
  );
};