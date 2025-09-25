
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StyleAdvisor } from './components/StyleAdvisor';
import { SparkleIcon } from './components/icons/SparkleIcon';
import { HomePage } from './components/HomePage';
import { AboutUsPage } from './components/AboutUsPage';
import { WishlistPage } from './components/WishlistPage';
import { CartPage } from './components/CartPage';
import { ProfilePage } from './components/ProfilePage';
import { SearchPage } from './components/SearchPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { GuestLoginPage } from './components/GuestLoginPage';
import { Page, Product, CartItem, ShippingInfo, Order } from './types';
import { FAQPage } from './components/FAQPage';
import { BestsellerPage } from './components/BestsellerPage';
import { NewArrivalsPage } from './components/NewArrivalsPage';
import { CombosPage } from './components/CombosPage';
import { GiftingPage } from './components/GiftingPage';
import { RingsPage } from './components/RingsPage';
import { NecklacesPage } from './components/NecklacesPage';
import { BraceletsPage } from './components/BraceletsPage';
import { EarringsPage } from './components/EarringsPage';
import { AnkletsPage } from './components/AnkletsPage';
import { AntiquesPage } from './components/AntiquesPage';
import { CollectionsPage } from './components/CollectionsPage';
import { productsData } from './constants';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<number[]>([]); // Array of product IDs
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isGuestLoggedIn, setIsGuestLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Data is loaded from a local constant file, so no API call is needed.
    // This is a synchronous operation.
    try {
      setProducts(productsData);
    } catch(e) {
      console.error("Failed to load products", e);
      setError("Could not load product information. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

    // Simulate order placement on the client-side
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxes = subtotal * 0.08;
    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + taxes + shipping;

    const newOrder: Order = {
      orderNumber: `VAJRA-${Date.now()}`,
      items: cartItems,
      shippingInfo,
      subtotal,
      taxes,
      total,
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
    if (page === 'profile' && !isGuestLoggedIn) {
      setCurrentPage('guestLogin');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  }
  
  const handleLoginAsGuest = () => {
    setIsGuestLoggedIn(true);
    setCurrentPage('profile');
    window.scrollTo(0, 0);
  };

  const wishlistedProducts = products.filter(p => wishlistItems.includes(p.id));
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const renderPage = () => {
    const pageProps = {
      products: products,
      onAddToCart: handleAddToCart,
      onToggleWishlist: handleToggleWishlist,
      wishlistItems: wishlistItems,
      onViewProduct: handleViewProduct,
    };

    switch (currentPage) {
      case 'bestseller':
        return <BestsellerPage {...pageProps} />;
      case 'newarrivals':
        return <NewArrivalsPage {...pageProps} />;
      case 'combos':
        return <CombosPage {...pageProps} />;
      case 'gifting':
        return <GiftingPage {...pageProps} />;
      case 'rings':
        return <RingsPage {...pageProps} />;
      case 'necklaces':
        return <NecklacesPage {...pageProps} />;
      case 'bracelets':
        return <BraceletsPage {...pageProps} />;
      case 'earrings':
        return <EarringsPage {...pageProps} />;
      case 'anklets':
        return <AnkletsPage {...pageProps} />;
      case 'antiques':
        return <AntiquesPage {...pageProps} />;
      case 'collections':
        return <CollectionsPage {...pageProps} />;
      case 'about':
        return <AboutUsPage />;
      case 'faq':
        return <FAQPage />;
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
        return selectedProduct ? <ProductDetailPage product={selectedProduct} {...pageProps} /> : <HomePage onNavigate={handleNavigate} />;
      case 'guestLogin':
        return <GuestLoginPage onGuestLogin={handleLoginAsGuest} />;
      case 'home':
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-[#5c1f2b] text-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-serif">Loading, please wait...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#5c1f2b] text-red-400 min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-serif">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#5c1f2b] text-white min-h-screen flex flex-col">
      <Header 
        cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistItemCount={wishlistItems.length}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />

      {/* AI Style Advisor FAB */}
      <button
        onClick={() => setIsAdvisorOpen(true)}
        className="fixed bottom-6 right-6 bg-[#4a1922] hover:bg-[#6b2a36] text-white p-4 rounded-full shadow-lg hover:scale-110 transform transition-all duration-300 ease-in-out z-50 flex items-center gap-2 border border-white/20"
        aria-label="Open AI Style Advisor"
      >
        <SparkleIcon className="w-6 h-6" />
        <span className="hidden md:inline font-semibold">AI Style Advisor</span>
      </button>

      {isAdvisorOpen && <StyleAdvisor onClose={() => setIsAdvisorOpen(false)} />}
    </div>
  );
};

export default App;