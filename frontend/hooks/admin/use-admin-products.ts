import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/lib/products';
import type { Product } from '@/app/types/product';

export interface AdminProductsFilters {
  page: number;
  limit: number;
}

export const adminProductKeys = {
  all: ['admin', 'products'] as const,
  list: (filters: AdminProductsFilters) => [...adminProductKeys.all, 'list', filters] as const,
  detail: (id: string) => [...adminProductKeys.all, 'detail', id] as const,
};

export function useAdminProducts(
  filters: AdminProductsFilters,
  options?: { initialData?: Awaited<ReturnType<typeof getProducts>> },
) {
  return useQuery({
    queryKey: adminProductKeys.list(filters),
    queryFn: () => getProducts(filters.page, filters.limit),
    initialData: options?.initialData,
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: adminProductKeys.detail(id),
    queryFn: async () => {
      const product = await getProduct(id);
      if (!product) {
        throw new Error('Product could not be loaded');
      }
      return product;
    },
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Product) => createProduct(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminProductKeys.all }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      updateProduct(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      queryClient.invalidateQueries({ queryKey: adminProductKeys.detail(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminProductKeys.all }),
  });
}
