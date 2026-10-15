import { api } from './api';
import { Order } from '../types';

export const orderService = {
  /**
   * Fetch orders list (user's own or all if admin)
   */
  getOrders: async (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const queryString = query.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    return api.get<{ orders: Order[]; totalCount: number }>(endpoint);
  },

  /**
   * Get single order by orderId
   */
  getOrderById: async (orderId: string) => {
    return api.get<{ order: Order }>(`/orders/${orderId}`);
  },

  /**
   * Place a manual or direct order
   */
  createOrder: async (orderPayload: Partial<Order>) => {
    return api.post<{ order: Order }>('/orders', orderPayload);
  },

  /**
   * Update order status (Admin)
   */
  updateOrderStatus: async (orderId: string, status: string, trackingNumber?: string) => {
    return api.patch<{ order: Order }>(`/orders/${orderId}/status`, {
      status,
      trackingNumber,
    });
  },

  /**
   * Delete order (Admin)
   */
  deleteOrder: async (orderId: string) => {
    return api.delete(`/orders/${orderId}`);
  },
};

export default orderService;
