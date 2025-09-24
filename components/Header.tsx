
import React from 'react';
import { UserIcon } from './icons/UserIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { HeartIcon } from './icons/HeartIcon';
import { Page } from '../types';
import { VajraLogo } from './VajraLogo';

interface HeaderProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, wishlistItemCount, onNavigate, currentPage }) => {
  
  const navLinkClasses = (page: Page) => {
    const baseClasses = "hover:text-amber-800 transition-colors pb-1";
    const activeClasses = "text-amber-800 border-b-2 border-amber-800 font-semibold";
    return `${baseClasses} ${currentPage === page ? activeClasses : 'border-b-2 border-transparent'}`;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, page: Page) => {
    e.preventDefault();
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 bg-[#FDFBF8]/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="text-3xl font-bold font-serif text-amber-900 tracking-wider">
          <VajraLogo />
        </a>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-gray-700">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={navLinkClasses('home')}>HOME</a>
          <a href="#rings" onClick={(e) => handleNavClick(e, 'rings')} className={navLinkClasses('rings')}>RINGS</a>
          <a href="#necklaces" onClick={(e) => handleNavClick(e, 'necklaces')} className={navLinkClasses('necklaces')}>NECKLACES</a>
          <a href="#collections" onClick={(e) => handleNavClick(e, 'collections')} className={navLinkClasses('collections')}>COLLECTIONS</a>
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={navLinkClasses('about')}>ABOUT US</a>
        </nav>
        <div className="flex items-center space-x-5">
          <button onClick={(e) => handleNavClick(e, 'search')} className="text-gray-600 hover:text-amber-800 transition-colors" aria-label="Search">
            <SearchIcon className="w-5 h-5" />
          </button>
          <button onClick={(e) => handleNavClick(e, 'profile')} className="text-gray-600 hover:text-amber-800 transition-colors" aria-label="Account">
            <UserIcon className="w-5 h-5" />
          </button>
           <button onClick={(e) => handleNavClick(e, 'wishlist')} className="relative text-gray-600 hover:text-amber-800 transition-colors" aria-label="Wishlist">
            <HeartIcon className="w-5 h-5" />
            {wishlistItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {wishlistItemCount}
              </span>
            )}
          </button>
          <button onClick={(e) => handleNavClick(e, 'cart')} className="relative text-gray-600 hover:text-amber-800 transition-colors" aria-label="Shopping Cart">
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
