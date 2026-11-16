import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import type { Order } from '@/store/useOrderStore';

export type AdminOrderStatus = Order['orderStatus'];

export interface AdminOrdersFilters {
  search?: string;
  status?: AdminOrderStatus | 'all';
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

interface AdminOrdersResponse {
  data: Order[];
  totalPages: number;
  total?: number;
}

export const adminOrderKeys = {
  all: ['admin', 'orders'] as const,
  list: (filters: AdminOrdersFilters) => [...adminOrderKeys.all, 'list', filters] as const,
};

async function fetchAdminOrders(filters: AdminOrdersFilters): Promise<AdminOrdersResponse> {
  const { search, status, paymentMethod, startDate, endDate, page, limit } = filters;
  const params = {
    ...(search && { search }),
    ...(status && status !== 'all' && { status }),
    ...(paymentMethod && paymentMethod !== 'all' && { paymentMethod }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    page,
    limit,
  };
  const res = await axiosInstance.get('/orders/admin/all', { params });
  return res.data;
}

export function useAdminOrders(filters: AdminOrdersFilters) {
  return useQuery({
    queryKey: adminOrderKeys.list(filters),
    queryFn: () => fetchAdminOrders(filters),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: AdminOrderStatus }) =>
      axiosInstance.put(`/orders/${orderId}/status`, { status }),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey: adminOrderKeys.all });
      const previousData = queryClient.getQueriesData<AdminOrdersResponse>({ queryKey: adminOrderKeys.all });
      queryClient.setQueriesData<AdminOrdersResponse>(
        { queryKey: adminOrderKeys.all },
        (old) => {
          if (!old?.data) return old;
          return { ...old, data: old.data.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o)) };
        }
      );
      return { previousData };
    },
    onError: (_err, _vars, context) => {
      context?.previousData.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
    },
  });
}
