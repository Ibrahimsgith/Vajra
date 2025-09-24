
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  description: string;
  galleryImageUrls: string[];
}

export interface CartItem extends Product {
    quantity: number;
}

export interface StyleAdvice {
  jewelryType: string;
  metal: string;
  gemstone: string;
  styleDescription: string;
}

export interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  orderNumber: string;
  items: CartItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  taxes: number;
  total: number;
}

export type Page = 'home' | 'rings' | 'necklaces' | 'collections' | 'about' | 'wishlist' | 'cart' | 'profile' | 'search' | 'checkout' | 'orderConfirmation' | 'productDetail';
