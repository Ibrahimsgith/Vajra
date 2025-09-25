
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { HeartIcon } from './icons/HeartIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: number) => void;
  onViewProduct: (productId: number) => void;
  wishlistItems: number[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, products, onAddToCart, onToggleWishlist, onViewProduct, wishlistItems }) => {
  const [mainImage, setMainImage] = useState(product.galleryImageUrls[0] || product.imageUrl);
  const isWishlisted = wishlistItems.includes(product.id);

  // Reset main image when the product prop changes, e.g., when clicking a related product
  useEffect(() => {
    setMainImage(product.galleryImageUrls[0] || product.imageUrl);
    window.scrollTo(0, 0);
  }, [product]);


  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-[#5c1f2b] py-16 sm:py-20 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-[#4a1922] rounded-lg overflow-hidden mb-4 shadow-sm border border-white/10">
              <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.galleryImageUrls.map((url, index) => (
                <div 
                  key={index} 
                  className={`aspect-square bg-[#4a1922] rounded-md overflow-hidden cursor-pointer border-2 transition-colors ${mainImage === url ? 'border-white' : 'border-transparent hover:border-red-300/50'}`}
                  onClick={() => setMainImage(url)}
                >
                  <img src={url} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium text-white/70 uppercase tracking-wider">{product.category}</p>
            <h1 className="text-4xl sm:text-5xl font-serif text-white my-3">{product.name}</h1>
            <p className="text-3xl text-white/90 font-light mb-6">${product.price.toLocaleString()}</p>
            
            <div className="prose text-white/80 mb-8">
              <p>{product.description}</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 bg-white text-[#5c1f2b] font-bold py-4 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className="p-4 border-2 border-white/20 rounded-lg text-white/80 hover:border-white hover:text-white transition-colors"
                aria-label="Toggle Wishlist"
              >
                <HeartIcon className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-red-400 fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* You Might Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-16 border-t border-white/10">
            <h2 className="text-3xl font-serif text-center text-white mb-12">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  onViewProduct={onViewProduct}
                  isWishlisted={wishlistItems.includes(relatedProduct.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
