import { api } from './api';
import { Product } from '../types';

export const productService = {
  /**
   * Fetch catalog products from MongoDB backend
   */
  getProducts: async (params?: { category?: string; search?: string; inStock?: boolean; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.inStock !== undefined) query.append('inStock', String(params.inStock));
    if (params?.sort) query.append('sort', params.sort);

    const queryString = query.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    return api.get<{ products: Product[]; totalCount: number }>(endpoint);
  },

  /**
   * Get single product by ID
   */
  getProductById: async (id: string) => {
    return api.get<{ product: Product }>(`/products/${id}`);
  },

  /**
   * Get product categories metadata
   */
  getCategories: async () => {
    return api.get<{ categories: Array<{ id: string; name: string; count: number; icon: string }> }>(
      '/categories'
    );
  },

  /**
   * Create new product (Admin)
   */
  createProduct: async (productData: Partial<Product>) => {
    return api.post<{ product: Product }>('/products', productData);
  },

  /**
   * Update product (Admin)
   */
  updateProduct: async (id: string, productData: Partial<Product>) => {
    return api.put<{ product: Product }>(`/products/${id}`, productData);
  },

  /**
   * Delete product (Admin)
   */
  deleteProduct: async (id: string) => {
    return api.delete(`/products/${id}`);
  },
};

export default productService;
