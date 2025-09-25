
import React from 'react';
import { Order, Page } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (page: Page) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order, onNavigate }) => {
  const handleDownloadPdf = () => {
    const input = document.getElementById('invoice-content');
    if (!input || !order) {
        console.error("Could not find element to print or order details are missing.");
        return;
    }

    html2canvas(input, {
      backgroundColor: '#4a1922', // Match the component background
      scale: 2, // Improve resolution
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      // Use px as unit, and match the format to the canvas size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Vajra-Invoice-${order.orderNumber}.pdf`);
    });
  };

  if (!order) {
    return (
      <div className="bg-[#5c1f2b] py-20 text-center">
        <h1 className="text-2xl text-white/80">No order details found.</h1>
        <button onClick={() => onNavigate('home')} className="mt-6 bg-white text-[#5c1f2b] font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors">
          Go to Homepage
        </button>
      </div>
    );
  }

  const { orderNumber, items, shippingInfo, subtotal, taxes, total } = order;

  return (
    <div className="bg-[#5c1f2b] py-20 animate-fade-in">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-green-400 mb-4" />
          <h1 className="text-5xl font-serif text-white">Thank You For Your Order!</h1>
          <p className="text-white/80 mt-4">Your order has been placed successfully. A confirmation has been sent to your email.</p>
          <p className="text-lg font-semibold mt-2">Order Number: <span className="text-white">{orderNumber}</span></p>
        </div>

        <div id="invoice-content" className="bg-[#4a1922] border border-white/10 rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-serif text-white border-b border-white/10 pb-3 mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center text-sm">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                     <div className="space-y-2 border-t border-white/10 pt-4 mt-4 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        <div className="flex justify-between text-white/70"><span>Taxes</span><span>${taxes.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                        <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-2"><span>Total</span><span>${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-serif text-white border-b border-white/10 pb-3 mb-4">Shipping To</h2>
                    <div className="text-sm space-y-1 text-white/90">
                        <p className="font-semibold">{shippingInfo.fullName}</p>
                        <p>{shippingInfo.address}</p>
                        <p>{shippingInfo.city}, {shippingInfo.zipCode}</p>
                        <p>{shippingInfo.country}</p>
                    </div>
                </div>
            </div>
        </div>

         <div className="text-center mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => onNavigate('collections')} className="bg-white text-[#5c1f2b] font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto">
                Continue Shopping
            </button>
            <button 
                onClick={handleDownloadPdf}
                className="bg-transparent border border-white/30 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
                <DownloadIcon className="w-5 h-5" />
                <span>Download Invoice</span>
            </button>
        </div>

      </div>
    </div>
  );
};