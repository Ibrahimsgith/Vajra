
import React from 'react';
import { Order, Page } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (page: Page) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onNavigate }) => {
  if (!order) {
    return (
      <div className="bg-white py-20 text-center">
        <h1 className="text-2xl text-gray-700">No order details found.</h1>
        <button onClick={() => onNavigate('home')} className="mt-6 bg-amber-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-900 transition-colors">
          Go to Homepage
        </button>
      </div>
    );
  }

  const { orderNumber, items, shippingInfo, subtotal, taxes, total } = order;

  return (
    <div className="bg-white py-20 animate-fade-in">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h1 className="text-5xl font-serif text-amber-900">Thank You For Your Order!</h1>
          <p className="text-gray-600 mt-4">Your order has been placed successfully. A confirmation has been sent to your email.</p>
          <p className="text-lg font-semibold mt-2">Order Number: <span className="text-amber-800">{orderNumber}</span></p>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-serif text-gray-800 border-b pb-3 mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center text-sm">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                     <div className="space-y-2 border-t pt-4 mt-4 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        <div className="flex justify-between text-gray-600"><span>Taxes</span><span>${taxes.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2"><span>Total</span><span>${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-serif text-gray-800 border-b pb-3 mb-4">Shipping To</h2>
                    <div className="text-sm space-y-1 text-gray-700">
                        <p className="font-semibold">{shippingInfo.fullName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                    </div>
                </div>
            </div>
        </div>

         <div className="text-center mt-12">
            <button onClick={() => onNavigate('collections')} className="bg-amber-800 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-900 transition-colors">
            Continue Shopping
            </button>
        </div>

      </div>
    </div>
  );
};
