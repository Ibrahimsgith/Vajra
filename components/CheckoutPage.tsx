import React, { useState } from 'react';
import { CartItem, Page, ShippingInfo } from '../types';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { GooglePayIcon } from './icons/GooglePayIcon';

interface CheckoutPageProps {
  cartItems: CartItem[];
  onPlaceOrder: (shippingInfo: ShippingInfo) => void;
  onNavigate: (page: Page) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, onPlaceOrder, onNavigate }) => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 25; // Free shipping over $500
  const total = subtotal + taxes + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(shippingInfo).some(field => field === '')) {
      alert('Please fill out all shipping fields.');
      return;
    }
    onPlaceOrder(shippingInfo);
  };
  
  if (cartItems.length === 0) {
      return (
          <div className="container mx-auto text-center py-20">
              <h1 className="text-2xl text-white/80">Your cart is empty.</h1>
              <button onClick={() => onNavigate('collections')} className="mt-4 bg-white text-[#5c1f2b] font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">Shop Now</button>
          </div>
      )
  }

  return (
    <div className="bg-[#5c1f2b] py-16 animate-fade-in">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-serif text-center text-white mb-12">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              {/* Shipping Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-3 mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-white/80">Full Name</label>
                    <input type="text" id="fullName" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border-white/20 rounded-md shadow-sm focus:ring-white focus:border-white text-white" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-white/80">Address</label>
                    <input type="text" id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border-white/20 rounded-md shadow-sm focus:ring-white focus:border-white text-white" required />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-white/80">City</label>
                    <input type="text" id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border-white/20 rounded-md shadow-sm focus:ring-white focus:border-white text-white" required />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-white/80">Postal / ZIP Code</label>
                    <input type="text" id="zipCode" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border-white/20 rounded-md shadow-sm focus:ring-white focus:border-white text-white" required />
                  </div>
                  <div className="sm:col-span-2">
                     <label htmlFor="country" className="block text-sm font-medium text-white/80">Country</label>
                    <input type="text" id="country" name="country" value={shippingInfo.country} onChange={handleInputChange} className="mt-1 block w-full bg-white/5 border-white/20 rounded-md shadow-sm focus:ring-white focus:border-white text-white" required />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                 <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-3 mb-6">Payment Method</h2>
                 <div className="space-y-4">
                    <div onClick={() => setPaymentMethod('creditCard')} className={`border rounded-lg p-4 flex items-center cursor-pointer ${paymentMethod === 'creditCard' ? 'border-white ring-2 ring-white' : 'border-white/20'}`}>
                        <input type="radio" name="paymentMethod" value="creditCard" checked={paymentMethod === 'creditCard'} className="h-4 w-4 text-white focus:ring-white bg-transparent" onChange={() => {}}/>
                        <label className="ml-3 flex items-center text-sm font-medium text-white"><CreditCardIcon className="w-6 h-6 mr-2 text-white/80" /> Credit Card</label>
                    </div>
                     <div onClick={() => setPaymentMethod('googlePay')} className={`border rounded-lg p-4 flex items-center cursor-pointer ${paymentMethod === 'googlePay' ? 'border-white ring-2 ring-white' : 'border-white/20'}`}>
                        <input type="radio" name="paymentMethod" value="googlePay" checked={paymentMethod === 'googlePay'} className="h-4 w-4 text-white focus:ring-white bg-transparent" onChange={() => {}}/>
                        <label className="ml-3 flex items-center text-sm font-medium text-white"><GooglePayIcon className="w-auto h-5 mr-2" /> Google Pay</label>
                    </div>
                 </div>
              </div>
               <button type="submit" className="w-full bg-white text-[#5c1f2b] font-bold py-4 mt-8 rounded-lg hover:bg-gray-200 transition-colors text-lg">
                Place Order
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-[#4a1922] p-6 rounded-lg shadow-sm h-fit sticky top-28 border border-white/10">
                <h2 className="text-2xl font-serif border-b border-white/10 pb-4 mb-4">Order Summary</h2>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center">
                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                            <div className="flex-grow">
                                <p className="font-semibold text-sm">{item.name}</p>
                                <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                            </div>
                             <p className="text-sm font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-2 border-t border-white/10 pt-4 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                   <div className="flex justify-between text-sm text-white/70">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toLocaleString(undefined, {minimumFractionDigits: 2})}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Taxes (8%)</span>
                    <span>${taxes.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-white/10 pt-4 mt-4">
                    <span>Total</span>
                    <span>${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};