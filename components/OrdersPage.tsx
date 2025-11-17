import React, { useMemo, useState } from 'react';
import { Order, OrderStatus, Page } from '../types';

interface OrdersPageProps {
  orders: Order[];
  onUpdateStatus: (orderNumber: string, status: OrderStatus) => void;
  onNavigate: (page: Page) => void;
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/20 text-amber-200 border border-amber-400/50',
  processing: 'bg-blue-500/20 text-blue-200 border border-blue-400/50',
  shipped: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/50',
  delivered: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/50',
  cancelled: 'bg-red-500/20 text-red-200 border border-red-400/50',
};

const formatDate = (isoString?: string) => {
  if (!isoString) return 'Just now';
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const OrdersPage: React.FC<OrdersPageProps> = ({ orders, onUpdateStatus, onNavigate }) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orders.filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const customerName = order.shippingInfo.fullName || `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.trim();
      const matchesSearch = normalizedSearch.length === 0 ||
        order.orderNumber.toLowerCase().includes(normalizedSearch) ||
        customerName.toLowerCase().includes(normalizedSearch) ||
        order.shippingInfo.email.toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="bg-[#5c1f2b] min-h-screen py-16 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Operations</p>
            <h1 className="text-5xl font-serif text-white">Order Management</h1>
            <p className="text-white/70 mt-2">Track, filter, and update customer orders in one place.</p>
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="self-start md:self-center bg-white text-[#5c1f2b] font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Return to Storefront
          </button>
        </div>

        <div className="bg-[#4a1922] border border-white/10 rounded-lg p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Search orders</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Order number, customer, or email"
                className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors ${statusFilter === 'all' ? 'bg-white text-[#5c1f2b] border-white' : 'bg-transparent text-white/80 border-white/20 hover:bg-white/10'}`}
                >
                  All
                </button>
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`px-4 py-2 rounded-md border text-sm font-semibold transition-colors ${statusFilter === option.value ? 'bg-white text-[#5c1f2b] border-white' : 'bg-transparent text-white/80 border-white/20 hover:bg-white/10'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Create a new order</label>
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full px-4 py-3 rounded-md bg-white text-[#5c1f2b] font-bold hover:bg-gray-200 transition-colors"
              >
                Start Checkout
              </button>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-[#4a1922] border border-white/10 rounded-lg p-10 text-center text-white/80">
            <p className="text-xl font-semibold mb-2">No orders found</p>
            <p className="text-white/60">Try adjusting your filters or create a new order from checkout.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const customerName = order.shippingInfo.fullName && order.shippingInfo.fullName.trim().length > 0
                ? order.shippingInfo.fullName
                : `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.trim();
              const status = order.status ?? 'processing';
              const statusLabel = statusOptions.find(option => option.value === status)?.label ?? 'Processing';

              return (
                <div key={order.orderNumber} className="bg-[#4a1922] border border-white/10 rounded-lg p-6 shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <p className="text-sm text-white/60">Order</p>
                      <h3 className="text-2xl font-serif text-white">{order.orderNumber}</h3>
                      <p className="text-white/60 text-sm">Placed {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusStyles[status]}`}>
                        {statusLabel}
                      </span>
                      <select
                        value={status}
                        onChange={(e) => onUpdateStatus(order.orderNumber, e.target.value as OrderStatus)}
                        className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-[#4a1922] text-white">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4">
                    <div className="lg:col-span-2 space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-md p-3">
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold">Customer</h4>
                      <p className="text-white/90">{customerName}</p>
                      <p className="text-white/70 text-sm">{order.shippingInfo.email}</p>
                      <p className="text-white/70 text-sm">{order.shippingInfo.phone}</p>
                      <p className="text-white/60 text-sm">{order.shippingInfo.city}, {order.shippingInfo.country}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold">Payment</h4>
                      <div className="flex justify-between text-sm text-white/80">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm text-white/60">
                        <span>Taxes</span>
                        <span>${order.taxes.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      {typeof order.shipping === 'number' && (
                        <div className="flex justify-between text-sm text-white/60">
                          <span>Shipping</span>
                          <span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold text-white">
                        <span>Total</span>
                        <span>${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      {order.paymentMethod && (
                        <p className="text-white/60 text-xs">Paid via {order.paymentMethod}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
