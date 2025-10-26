import { Product } from './types';
import productsJson from './backend/data/products.json';

export const productsData: Product[] = productsJson as Product[];
