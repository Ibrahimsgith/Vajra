
import React from 'react';
import { CartItem, Page } from '../types';
// FIX: Import the ShoppingCartIcon component.
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onNavigate: (page: Page) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemoveItem, onNavigate }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08; // Example tax rate
  const total = subtotal + taxes;

  return (
    <div className="bg-white py-16 animate-fade-in">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-serif text-center text-amber-900 mb-12">Shopping Cart</h1>
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-6" />
                    <div className="flex-grow">
                      <h2 className="font-serif text-lg text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-amber-900 font-semibold mt-1">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center mx-6">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 border rounded-l-md hover:bg-gray-200">-</button>
                      <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 border rounded-r-md hover:bg-gray-200">+</button>
                    </div>
                    <div className="text-right mx-6">
                      <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500">&times;</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-2xl font-serif border-b pb-4 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes (8%)</span>
                  <span>${taxes.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                  <span>Total</span>
                  <span>${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>
              <button onClick={() => onNavigate('checkout')} className="w-full bg-amber-800 text-white font-bold py-3 mt-6 rounded-lg hover:bg-amber-900 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 min-h-[40vh] flex flex-col justify-center items-center">
            <ShoppingCartIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg mb-6">Your shopping cart is empty.</p>
            <button onClick={() => onNavigate('collections')} className="bg-amber-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-900 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
