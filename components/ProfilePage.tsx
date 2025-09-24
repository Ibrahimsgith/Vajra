
import React from 'react';
import { UserIcon } from './icons/UserIcon';

export const ProfilePage: React.FC = () => {
  return (
    <div className="bg-white py-20 animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <UserIcon className="w-16 h-16 mx-auto text-amber-800 mb-4" />
            <h1 className="text-5xl font-serif text-amber-900">My Account</h1>
            <p className="text-gray-600 mt-4">Manage your orders and personal information.</p>
          </div>
          <div className="bg-gray-50 rounded-lg shadow-sm p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-gray-800 border-b pb-3 mb-4">Order History</h2>
              <p className="text-gray-500">You have not placed any orders yet.</p>
            </div>
            <div>
              <h2 className="text-2xl font-serif text-gray-800 border-b pb-3 mb-4">Account Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="font-semibold">Guest User</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="font-semibold">guest@example.com</p>
                  </div>
                </div>
                 <button className="text-amber-800 font-semibold hover:underline">Edit Details</button>
              </div>
            </div>
             <div>
              <h2 className="text-2xl font-serif text-gray-800 border-b pb-3 mb-4">Saved Addresses</h2>
              <p className="text-gray-500">You have no saved addresses.</p>
               <button className="mt-2 text-amber-800 font-semibold hover:underline">Add Address</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
