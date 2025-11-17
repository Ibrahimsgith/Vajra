import React, { useMemo, useState } from 'react';
import { Order } from '../types';

interface AdminLoginPageProps {
  orders: Order[];
  onLogin: (email: string, password: string) => void;
  error?: string | null;
  isAuthenticated?: boolean;
  adminEmail?: string;
  onNavigateHome?: () => void;
  onAdminLogout?: () => void;
}

const formatPreview = (order: Order) => {
  const name = order.shippingInfo.fullName && order.shippingInfo.fullName.trim().length > 0
    ? order.shippingInfo.fullName
    : `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`.trim();

  return `${order.orderNumber} · ${name} · ${order.status ?? 'processing'}`;
};

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ orders, onLogin, error, isAuthenticated, adminEmail, onNavigateHome, onAdminLogout }) => {
  const [email, setEmail] = useState('admin@vajra.com');
  const [password, setPassword] = useState('');

  const orderPreview = useMemo(() => orders.slice(0, 3), [orders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email.trim(), password);
  };

  return (
    <div className="bg-[#5c1f2b] min-h-screen py-16 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-[#4a1922] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-10 space-y-6 border-b md:border-b-0 md:border-r border-white/10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Admin Access</p>
              <h1 className="text-4xl font-serif text-white">Sign in to view orders</h1>
              <p className="text-white/70 mt-2">Securely access recent order details and customer contact info.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-white/70" htmlFor="admin-email">Work email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="admin@vajra.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/70" htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="Enter your admin password"
                />
              </div>

              {error && (
                <div className="text-sm text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                  {error}
                </div>
              )}

              {isAuthenticated && adminEmail && (
                <div className="text-sm text-emerald-200 bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3">
                  Signed in as <span className="font-semibold">{adminEmail}</span>.
                  {onNavigateHome && (
                    <button
                      type="button"
                      onClick={onNavigateHome}
                      className="ml-2 underline font-semibold"
                    >
                      Return to storefront
                    </button>
                  )}
                  {onAdminLogout && (
                    <button
                      type="button"
                      onClick={onAdminLogout}
                      className="ml-2 underline font-semibold"
                    >
                      Sign out
                    </button>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-white text-[#5c1f2b] font-bold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Sign in and view order previews
              </button>
            </form>

            <p className="text-xs text-white/50">Use demo credentials: admin@vajra.com / VajraAdmin!23</p>
          </div>

          <div className="bg-gradient-to-b from-white/5 to-white/0 p-8 md:p-10 space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">Order snapshots</p>
              <h2 className="text-2xl font-serif text-white">Recent activity</h2>
              <p className="text-white/70 text-sm">Preview the latest orders associated with your admin account.</p>

            <div className="space-y-3">
              {orderPreview.length === 0 ? (
                <div className="text-white/60 text-sm">No orders yet. New orders will appear here once placed.</div>
              ) : (
                orderPreview.map(order => (
                  <div key={order.orderNumber} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white/90 text-sm">
                    <div className="font-semibold">{order.orderNumber}</div>
                    <div className="text-white/70">{formatPreview(order)}</div>
                    <div className="text-white/60 text-xs mt-1">Payment: {order.paymentMethod ?? 'Processing'} · Total ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </div>
                ))
              )}
            </div>

              <div className="text-xs text-white/50">
                After successful login you can securely review order details alongside customer contact info.
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
