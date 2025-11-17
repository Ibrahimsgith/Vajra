export interface Product {
  id: number;
  name: string;
  category: string;
  productType: 'Rings' | 'Chains' | 'Bracelets' | 'Earrings' | 'Anklets' | 'Antiques' | 'Combos';
  price: number;
  imageUrl: string;
  description: string;
  galleryImageUrls: string[];
}

export interface CartItem extends Product {
    quantity: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface StyleAdvice {
  jewelryType: string;
  metal: string;
  gemstone: string;
  styleDescription: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  fullName?: string; // Legacy support for any existing orders persisted with a fullName field
}

export interface Order {
  orderNumber: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  taxes: number;
  total: number;
  shipping?: number;
  paymentMethod?: string;
  createdAt?: string;
  status?: OrderStatus;
}

export type Page =
  | 'home'
  | 'about'
  | 'wishlist'
  | 'cart'
  | 'profile'
  | 'search'
  | 'checkout'
  | 'orderConfirmation'
  | 'productDetail'
  | 'guestLogin'
  | 'faq'
  | 'bestseller'
  | 'newarrivals'
  | 'combos'
  | 'gifting'
  | 'collections'
  | 'rings'
  | 'necklaces'
  | 'bracelets'
  | 'earrings'
  | 'anklets'
  | 'antiques'
  | 'orders';
