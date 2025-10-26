import { Product } from '../types';
import { buildApiUrl } from './apiConfig';

export interface FetchProductsParams {
  category?: string;
  productType?: string;
  search?: string;
  limit?: number;
  pageSlug?: string;
}

interface PageProductsResponse {
  page: string;
  total: number;
  products: Product[];
}

const parseLimit = (value?: number | string): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    if (!response.ok) {
      throw new Error('Failed to load data from the Vajra API.');
    }
    throw error;
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message?: string }).message)
        : 'The Vajra API returned an error.';
    throw new Error(message);
  }

  return data as T;
};

export const fetchProducts = async (params?: FetchProductsParams): Promise<Product[]> => {
  if (params?.pageSlug) {
    const url = new URL(buildApiUrl(`/api/pages/${params.pageSlug}/products`));
    const limit = parseLimit(params.limit);
    if (limit) {
      url.searchParams.set('limit', String(limit));
    }

    let response: Response;
    try {
      response = await fetch(url.toString());
    } catch (error) {
      throw new Error('Unable to connect to the Vajra API. Please check your connection and try again.');
    }

    const data = await handleResponse<PageProductsResponse>(response);
    return Array.isArray(data.products) ? data.products : [];
  }

  const url = new URL(buildApiUrl('/api/products'));

  if (params?.category) {
    url.searchParams.set('category', params.category);
  }

  if (params?.productType) {
    url.searchParams.set('productType', params.productType);
  }

  if (params?.search) {
    url.searchParams.set('search', params.search);
  }

  const limit = parseLimit(params?.limit);
  if (limit) {
    url.searchParams.set('limit', String(limit));
  }

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch (error) {
    throw new Error('Unable to connect to the Vajra API. Please check your connection and try again.');
  }

  const data = await handleResponse<Product[]>(response);

  if (!Array.isArray(data)) {
    throw new Error('Unexpected response format received from the Vajra API.');
  }

  return data;
};

export const fetchProductById = async (id: number): Promise<Product> => {
  let response: Response;
  try {
    response = await fetch(buildApiUrl(`/api/products/${id}`));
  } catch (error) {
    throw new Error('Unable to connect to the Vajra API. Please check your connection and try again.');
  }

  return handleResponse<Product>(response);
};

export const searchProducts = async (term: string): Promise<Product[]> => {
  if (!term.trim()) {
    return [];
  }

  const url = new URL(buildApiUrl('/api/search'));
  url.searchParams.set('q', term);

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch (error) {
    throw new Error('Unable to connect to the Vajra API. Please check your connection and try again.');
  }

  return handleResponse<Product[]>(response);
};
