
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StyleAdvisor } from './components/StyleAdvisor';
import { SparkleIcon } from './components/icons/SparkleIcon';
import { HomePage } from './components/HomePage';
import { RingsPage } from './components/RingsPage';
import { NecklacesPage } from './components/NecklacesPage';
import { CollectionsPage } from './components/CollectionsPage';
import { AboutUsPage } from './components/AboutUsPage';
import { WishlistPage } from './components/WishlistPage';
import { CartPage } from './components/CartPage';
import { ProfilePage } from './components/ProfilePage';
import { SearchPage } from './components/SearchPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { Page, Product, CartItem, ShippingInfo, Order } from './types';
import { MOCK_PRODUCTS } from './constants';

const App: React.FC = () => {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]); // Array of product IDs
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);


  const handleAddToCart = (productToAdd: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });
  };
  
  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleToggleWishlist = (productId: number) => {
    setWishlistItems(prevIds => {
      if (prevIds.includes(productId)) {
        return prevIds.filter(id => id !== productId);
      }
      return [...prevIds, productId];
    });
  };
  
  const handlePlaceOrder = (shippingInfo: ShippingInfo) => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxes = subtotal * 0.08;
    const total = subtotal + taxes;

    const newOrder: Order = {
      orderNumber: `VAJRA-${Date.now()}`,
      items: [...cartItems],
      shippingInfo,
      total,
      subtotal,
      taxes,
    };

    setOrderDetails(newOrder);
    setCartItems([]);
    setCurrentPage('orderConfirmation');
    window.scrollTo(0, 0);
  };

  const handleViewProduct = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentPage('productDetail');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  const wishlistedProducts = MOCK_PRODUCTS.filter(p => wishlistItems.includes(p.id));
  const selectedProduct = MOCK_PRODUCTS.find(p => p.id === selectedProductId);

  const renderPage = () => {
    const pageProps = {
      onAddToCart: handleAddToCart,
      onToggleWishlist: handleToggleWishlist,
      wishlistItems: wishlistItems,
      onViewProduct: handleViewProduct,
    };

    switch (currentPage) {
      case 'rings':
        return <RingsPage {...pageProps} />;
      case 'necklaces':
        return <NecklacesPage {...pageProps} />;
      case 'collections':
        return <CollectionsPage {...pageProps} />;
      case 'about':
        return <AboutUsPage />;
      case 'wishlist':
        return <WishlistPage products={wishlistedProducts} {...pageProps} />;
      case 'cart':
        return <CartPage cartItems={cartItems} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'search':
        return <SearchPage {...pageProps} />;
       case 'checkout':
        return <CheckoutPage cartItems={cartItems} onPlaceOrder={handlePlaceOrder} onNavigate={handleNavigate} />;
      case 'orderConfirmation':
        return <OrderConfirmationPage order={orderDetails} onNavigate={handleNavigate} />;
      case 'productDetail':
        return selectedProduct ? <ProductDetailPage product={selectedProduct} {...pageProps} /> : <HomePage {...pageProps} />;
      case 'home':
      default:
        return <HomePage {...pageProps} />;
    }
  };

  return (
    <div className="bg-[#FDFBF8] text-gray-800 min-h-screen flex flex-col">
      <Header 
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistItemCount={wishlistItems.length}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />

      {/* AI Style Advisor FAB */}
      <button
        onClick={() => setIsAdvisorOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-amber-900 to-amber-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transform transition-transform duration-300 ease-in-out z-50 flex items-center gap-2"
        aria-label="Open AI Style Advisor"
      >
        <SparkleIcon className="w-6 h-6" />
        <span className="hidden md:inline">AI Style Advisor</span>
      </button>

      {isAdvisorOpen && <StyleAdvisor onClose={() => setIsAdvisorOpen(false)} />}
    </div>
  );
};

export default App;
