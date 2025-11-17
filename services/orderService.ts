import { CartItem, Order, ShippingInfo } from '../types';
import { buildApiUrl } from './apiConfig';

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
    response = await fetch(buildApiUrl('/api/orders'), {
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
