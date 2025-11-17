
import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { UserProfile } from '../types';

interface ProfilePageProps {
  userProfile: UserProfile | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile }) => {
  const displayName = userProfile?.name?.trim() || 'Guest User';
  const displayEmail = userProfile?.email?.trim() || 'guest@example.com';
  const displayPhone = userProfile?.phone?.trim();

  return (
    <div className="bg-[#5c1f2b] py-20 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <UserIcon className="w-16 h-16 mx-auto text-white mb-4" />
            <h1 className="text-5xl font-serif text-white">My Account</h1>
            <p className="text-white/80 mt-4">Manage your orders and personal information.</p>
          </div>
          <div className="bg-[#4a1922] border border-white/10 rounded-lg shadow-sm p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-3 mb-4">Order History</h2>
              <p className="text-white/70">You have not placed any orders yet.</p>
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-3 mb-4">Account Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white/70">Name</label>
                    <p className="font-semibold">{displayName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70">Email</label>
                    <p className="font-semibold">{displayEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70">Phone</label>
                    <p className="font-semibold">{displayPhone || 'Not provided'}</p>
                  </div>
                </div>
                 <button className="text-white font-semibold hover:underline">Edit Details</button>
              </div>
            </div>
             <div>
              <h2 className="text-2xl font-serif text-white border-b border-white/10 pb-3 mb-4">Saved Addresses</h2>
              <p className="text-white/70">You have no saved addresses.</p>
               <button className="mt-2 text-white font-semibold hover:underline">Add Address</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};