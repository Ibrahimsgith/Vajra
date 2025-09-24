
import React, { useState } from 'react';
import { Product } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface ProductDetailPageProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  wishlistItems: number[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onAddToCart, onToggleWishlist, wishlistItems }) => {
  const [mainImage, setMainImage] = useState(product.galleryImageUrls[0] || product.imageUrl);
  const isWishlisted = wishlistItems.includes(product.id);

  return (
    <div className="bg-white py-16 sm:py-20 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-sm">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.galleryImageUrls.map((url, index) => (
                <div 
                  key={index} 
                  className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${mainImage === url ? 'border-amber-800' : 'border-transparent hover:border-amber-400'}`}
                  onClick={() => setMainImage(url)}
                >
                  <img src={url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{product.category}</p>
            <h1 className="text-4xl sm:text-5xl font-serif text-amber-900 my-3">{product.name}</h1>
            <p className="text-3xl text-gray-800 font-light mb-6">${product.price.toLocaleString()}</p>
            
            <div className="prose text-gray-600 mb-8">
              <p>{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-amber-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-amber-900 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="p-4 border-2 rounded-lg text-gray-600 hover:border-amber-800 hover:text-amber-800 transition-colors"
                aria-label="Toggle Wishlist"
              >
                <HeartIcon className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
