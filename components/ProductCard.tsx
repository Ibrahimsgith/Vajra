import React from 'react';
import { Product } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, onViewProduct, isWishlisted }) => {
  const [ref, isVisible] = useScrollAnimation();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onViewProduct(product.id);
  };
  
  return (
    <div 
      ref={ref}
      className={`group relative overflow-hidden bg-[#4a1922] rounded-lg border border-white/10 transition-all duration-700 hover:shadow-xl hover:border-white/20 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} 
      onClick={handleCardClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product.id);
        }}
        className="absolute top-3 right-3 z-20 p-1.5 bg-black/30 rounded-full text-white/80 hover:text-white hover:bg-black/50 transition-all"
        aria-label="Toggle Wishlist"
      >
        <HeartIcon className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-400 fill-current' : ''}`} />
      </button>
      <div className="w-full h-64 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-5 text-center">
        <h3 className="text-lg font-medium text-white font-serif">{product.name}</h3>
        <p className="text-white/90 font-semibold mt-2">${product.price.toLocaleString()}</p>
      </div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="bg-white text-[#5c1f2b] font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};