
import React from 'react';
import { Hero } from './Hero';
import { FeaturedProducts } from './FeaturedProducts';
import { CategoryBanner } from './CategoryBanner';
import { Product } from '../types';

interface HomePageProps {
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  return (
    <>
      <Hero />
      <FeaturedProducts 
        onAddToCart={onAddToCart} 
        onToggleWishlist={onToggleWishlist}
        onViewProduct={onViewProduct}
        wishlistItems={wishlistItems} 
      />
      <CategoryBanner />
    </>
  );
};
