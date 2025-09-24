
import React from 'react';
import { Product } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, onViewProduct, isWishlisted }) => {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation when clicking the add to cart button or wishlist icon
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onViewProduct(product.id);
  };
  
  return (
    <div className="group relative overflow-hidden bg-gray-50 rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-xl cursor-pointer" onClick={handleCardClick}>
      <button
        onClick={() => onToggleWishlist(product.id)}
        className="absolute top-3 right-3 z-20 p-1.5 bg-white/70 rounded-full text-gray-600 hover:text-amber-800 hover:bg-white transition-all"
        aria-label="Toggle Wishlist"
      >
        <HeartIcon className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
      </button>
      <div className="w-full h-64 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-5 text-center">
        <h3 className="text-lg font-medium text-gray-800 font-serif">{product.name}</h3>
        <p className="text-amber-900 font-semibold mt-2">${product.price.toLocaleString()}</p>
      </div>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
        <button
          onClick={() => onAddToCart(product)}
          className="bg-white text-amber-900 font-bold py-2 px-6 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
