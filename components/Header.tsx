import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { HeartIcon } from './icons/HeartIcon';
import { Page } from '../types';

interface HeaderProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, wishlistItemCount, onNavigate, currentPage }) => {

  const navLinks: { page: Page; label: string; }[] = [
    { page: 'bestseller', label: 'Bestseller' },
    { page: 'newarrivals', label: 'New Arrivals' },
    { page: 'combos', label: 'Combos' },
    { page: 'gifting', label: 'Gifting' },
    { page: 'about', label: 'About Us' },
  ];
  
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, page: Page) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 bg-[#4a1922] z-50 border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col items-center text-center">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-4xl font-logo text-white" style={{ marginBottom: '1.5cm' }}>
            VajरA
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:space-x-8 text-sm font-medium tracking-wide">
            {navLinks.map(({ page, label }) => (
              <a
                key={page}
                href={`#${page}`}
                onClick={(e) => handleNavClick(e, page)}
                className={`text-white/80 hover:text-white transition-colors pb-1 ${currentPage === page ? 'text-white font-semibold' : ''}`}
              >
                {label.toUpperCase()}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="absolute top-0 right-0 h-full flex items-center pr-6 space-x-4">
          <button onClick={(e) => handleNavClick(e, 'search')} className="text-white/80 hover:text-white transition-colors" aria-label="Search">
            <SearchIcon className="w-5 h-5" />
          </button>
          <button onClick={(e) => handleNavClick(e, 'profile')} className="text-white/80 hover:text-white transition-colors" aria-label="Account">
            <UserIcon className="w-5 h-5" />
          </button>
           <button onClick={(e) => handleNavClick(e, 'wishlist')} className="relative text-white/80 hover:text-white transition-colors" aria-label="Wishlist">
            <HeartIcon className="w-5 h-5" />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#5c1f2b] text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {wishlistItemCount}
              </span>
            )}
          </button>
          <button onClick={(e) => handleNavClick(e, 'cart')} className="relative text-white/80 hover:text-white transition-colors" aria-label="Shopping Cart">
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-[#5c1f2b] text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};