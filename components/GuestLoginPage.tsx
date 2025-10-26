
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
            <p className="text-center text-white/80 mb-8">Continue as a guest to manage your profile.</p>

            <button
              onClick={onGuestLogin}
              className="w-full bg-white text-[#5c1f2b] font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Continue as Guest
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};
