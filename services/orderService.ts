import { CartItem, Order, ShippingInfo } from '../types';

declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiBaseUrl?: string;
    };
  }
}

const DEFAULT_DEV_API_BASE_URL = 'http://localhost:3001';

function normalizeBaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.href.replace(/\/+$/, '');
  } catch (error) {
    console.warn('Provided API base URL is invalid and will be ignored:', url, error);
    return '';
  }
}

function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envUrl) {
    const normalized = normalizeBaseUrl(envUrl);
    if (normalized) {
      return normalized;
    }
  }

  if (typeof window !== 'undefined') {
    const runtimeValue = window.__APP_CONFIG__?.apiBaseUrl;
    const runtimeUrl =
      typeof runtimeValue === 'string'
        ? runtimeValue.trim()
        : runtimeValue != null
          ? runtimeValue.toString().trim()
          : '';

    if (runtimeUrl) {
      const normalized = normalizeBaseUrl(runtimeUrl);
      if (normalized) {
        return normalized;
      }
    }
  }

  if (import.meta.env.DEV) {
    return DEFAULT_DEV_API_BASE_URL;
  }

  return '';
}

function ensureApiBaseUrl() {
  const baseUrl = resolveApiBaseUrl();

  if (!baseUrl) {
    throw new Error(
      'The Vajra backend API URL is not configured. Please set VITE_API_BASE_URL during the Vercel build or update public/app-config.json with your Render deployment URL.'
    );
  }

  return baseUrl;
}

interface OrderResponse extends Partial<Order> {
  message?: string;
  error?: string;
}

export async function createOrder(
  cartItems: CartItem[],
  shippingInfo: ShippingInfo,
  paymentMethod: string
): Promise<Order> {
  const subtotalFallback = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxesFallback = subtotalFallback * 0.08;
  const shippingFallback = subtotalFallback > 500 ? 0 : 25;
  const totalFallback = subtotalFallback + taxesFallback + shippingFallback;

  let response: Response;
  try {
    const apiBaseUrl = ensureApiBaseUrl();
    response = await fetch(`${apiBaseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems,
        items: cartItems, // Some deployments expect the items key
        shippingInfo,
        paymentMethod,
      }),
    });
  } catch (error) {
    throw new Error('Unable to connect to the payment service. Please check your connection and try again.');
  }

  let data: OrderResponse | undefined;
  try {
    data = (await response.json()) as OrderResponse;
  } catch (error) {
    // Non-JSON responses should still surface an error to the UI
    if (!response.ok) {
      throw new Error('Failed to place order. Please try again.');
    }
    throw error;
  }

  if (!response.ok || !data) {
    const message = data?.message || data?.error || 'Failed to place order. Please try again.';
    throw new Error(message);
  }

  return {
    orderNumber: data.orderNumber ?? `VAJRA-${Date.now()}`,
    items: data.items ?? cartItems,
    shippingInfo: data.shippingInfo ?? shippingInfo,
    subtotal: data.subtotal ?? subtotalFallback,
    taxes: data.taxes ?? taxesFallback,
    shipping: data.shipping ?? shippingFallback,
    total: data.total ?? totalFallback,
    paymentMethod: data.paymentMethod ?? paymentMethod,
    createdAt: data.createdAt,
  };
}
