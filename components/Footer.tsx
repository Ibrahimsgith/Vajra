
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 border-t border-stone-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold font-serif text-amber-900 tracking-wider mb-4">VAJRA</h3>
            <p className="text-gray-600 text-sm">Crafting timeless elegance since 2024.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-amber-800">All Collections</a></li>
              <li><a href="#" className="hover:text-amber-800">Rings</a></li>
              <li><a href="#" className="hover:text-amber-800">Necklaces</a></li>
              <li><a href="#" className="hover:text-amber-800">Bracelets</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">About Us</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-amber-800">Our Story</a></li>
              <li><a href="#" className="hover:text-amber-800">Craftsmanship</a></li>
              <li><a href="#" className="hover:text-amber-800">Contact Us</a></li>
              <li><a href="#" className="hover:text-amber-800">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-3">Subscribe for exclusive offers and stories.</p>
            <form className="flex">
              <input type="email" placeholder="Your email" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-amber-800" />
              <button className="bg-amber-800 text-white px-4 py-2 rounded-r-md hover:bg-amber-900 transition-colors">Sign Up</button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-stone-300 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Vajra Jewelry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
