import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';

interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    priceRange: {
      minVariantPrice: number;
      maxVariantPrice: number;
    }[];
  };
  quantity: number;
  size: {
    _id: string;
    name: string;
  };
  color: {
    _id: string;
    name: string;
  };
  price: number;
  hasReviewed?: boolean;
}

export interface Order {
  _id: string;
  customer?: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    flatHouse: string;
    area: string;
    city: string;
    state: string;
    pinCode: string;
  };
  paymentMethod: 'card' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentDetails?: {
    cardType: string;
    last4: string;
  };
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingCost: number;
  trackingNumber?: string;
  createdAt: string;
}

export interface CreateOrderItem {
  product: string;
  quantity: number;
  color: string;
  price: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    flatHouse: string;
    area: string;
    city: string;
    state: string;
    pinCode: string;
  };
  paymentMethod: 'card' | 'cod';
  totalAmount: number;
  shippingCost: number;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchOrders: () => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  createOrder: (payload: CreateOrderPayload) => Promise<Order>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,

  setOrders: orders => set({ orders }),
  setCurrentOrder: order => set({ currentOrder: order }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get('/orders');
      const data = response.data;
      if (!response.status) throw new Error(data.error);
      set({ orders: data.data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchOrderDetails: async orderId => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/orders/${orderId}`);
      const data = response.data;
      if (!response.status) throw new Error(data.error);
      set({ currentOrder: data.data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  cancelOrder: async orderId => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(`/orders/${orderId}/cancel`);
      const data = response.data;
      if (!response.status) throw new Error(data.error);

      // Update the order in the list
      const orders = get().orders.map(order =>
        order._id === orderId
          ? { ...order, orderStatus: 'cancelled' as const }
          : order
      );
      const current = get().currentOrder;
      set({
        orders,
        currentOrder:
          current && current._id === orderId
            ? { ...current, orderStatus: 'cancelled' }
            : current,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createOrder: async payload => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/orders', payload);
      const order = response.data?.data as Order;
      set({ currentOrder: order, loading: false });
      return order;
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        (error as Error).message ||
        'Failed to create order';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },
}));
