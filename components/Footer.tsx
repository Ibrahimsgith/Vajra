import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: Page) => {
    e.preventDefault();
    onNavigate(page);
  };
  
  return (
    <footer className="bg-[#4a1922] border-t border-white/10">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-logo text-white mb-4">VajरA</h3>
            <p className="text-white/70 text-sm">Crafting timeless elegance since 2024.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#bestseller" onClick={(e) => handleNavClick(e, 'bestseller')} className="hover:text-white">Bestseller</a></li>
              <li><a href="#newarrivals" onClick={(e) => handleNavClick(e, 'newarrivals')} className="hover:text-white">New Arrivals</a></li>
              <li><a href="#combos" onClick={(e) => handleNavClick(e, 'combos')} className="hover:text-white">Combos</a></li>
              <li><a href="#gifting" onClick={(e) => handleNavClick(e, 'gifting')} className="hover:text-white">Gifting</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Jewellery Care</a></li>
              <li><a href="#" className="hover:text-white">Review</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-white">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-white/70 mb-3">Subscribe for exclusive offers and stories.</p>
            <form className="flex">
              <input type="email" placeholder="Your email" className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-l-md text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white" />
              <button className="bg-white text-[#5c1f2b] font-bold px-4 py-2 rounded-r-md hover:bg-gray-200 transition-colors">Sign Up</button>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Vajra Jewelry. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};