import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCustomers, updateCustomer, deleteCustomer } from '@/lib/customers';

export interface AdminCustomersFilters {
  page: number;
  limit: number;
  search: string;
}

export const adminCustomerKeys = {
  all: ['admin', 'customers'] as const,
  list: (filters: AdminCustomersFilters) => [...adminCustomerKeys.all, 'list', filters] as const,
};

export function useAdminCustomers(filters: AdminCustomersFilters) {
  return useQuery({
    queryKey: adminCustomerKeys.list(filters),
    queryFn: () => getCustomers(filters.page, filters.limit, filters.search),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCustomer(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminCustomerKeys.all }),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminCustomerKeys.all }),
  });
}
