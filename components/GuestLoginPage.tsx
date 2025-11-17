
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface GuestLoginPageProps {
  onGuestLogin: (profile: UserProfile) => void;
}

export const GuestLoginPage: React.FC<GuestLoginPageProps> = ({ onGuestLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onGuestLogin({
      name: name.trim() || 'Guest User',
      email: email.trim(),
      phone: phone.trim() || undefined,
    });
  };

  const isFormValid = email.trim().length > 0;

  return (
    <div className="bg-[#5c1f2b] py-20 animate-fade-in">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#4a1922] border border-white/10 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-serif text-center text-white mb-4">Welcome Back</h1>
            <p className="text-center text-white/80 mb-8">
              Sign in with your details to personalize your experience.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 border border-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 border border-white/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 border border-white/10"
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-white text-[#5c1f2b] font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to My Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
