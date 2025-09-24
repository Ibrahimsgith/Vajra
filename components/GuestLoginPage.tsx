
import React from 'react';

interface GuestLoginPageProps {
  onGuestLogin: () => void;
}

export const GuestLoginPage: React.FC<GuestLoginPageProps> = ({ onGuestLogin }) => {
  return (
    <div className="bg-[#5c1f2b] py-20 animate-fade-in">
      <div className="container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-[#4a1922] border border-white/10 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-serif text-center text-white mb-4">Welcome</h1>
            <p className="text-center text-white/80 mb-8">Sign in or continue as a guest to manage your profile.</p>
            
            <button 
              onClick={onGuestLogin}
              className="w-full bg-white text-[#5c1f2b] font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors mb-6"
            >
              Continue as Guest
            </button>

            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-white/20"></div>
              <span className="flex-shrink mx-4 text-white/50">Or</span>
              <div className="flex-grow border-t border-white/20"></div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80">Email</label>
                  <input type="email" id="email" className="mt-1 block w-full bg-white/10 border-white/20 rounded-md shadow-sm disabled:bg-white/5 cursor-not-allowed" disabled placeholder="demo@example.com" />
                </div>
                <div>
                  <label htmlFor="password-login" className="block text-sm font-medium text-white/80">Password</label>
                  <input type="password" id="password-login" className="mt-1 block w-full bg-white/10 border-white/20 rounded-md shadow-sm disabled:bg-white/5 cursor-not-allowed" disabled placeholder="••••••••" />
                </div>
                <button 
                  type="submit"
                  disabled
                  className="w-full bg-gray-600 text-white/70 font-bold py-3 px-4 rounded-lg cursor-not-allowed"
                >
                  Sign In
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};