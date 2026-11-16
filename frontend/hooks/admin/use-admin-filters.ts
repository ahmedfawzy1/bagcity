import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilters } from '@/lib/filters/filters';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/filters/category';
import { createColor, updateColor, deleteColor } from '@/lib/filters/color';
import type { Category, Color, Filter } from '@/app/types/filter';

export const adminFilterKeys = {
  all: ['admin', 'filters'] as const,
};

export function useFilters() {
  return useQuery({
    queryKey: adminFilterKeys.all,
    queryFn: getFilters,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Category) => createCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminFilterKeys.all }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminFilterKeys.all }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminFilterKeys.all }),
  });
}

export function useCreateColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Color) => createColor(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminFilterKeys.all }),
  });
}

export function useUpdateColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Color> }) =>
      updateColor(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminFilterKeys.all }),
  });
}

export function useDeleteColor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteColor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminFilterKeys.all }),
  });
}

export type { Category, Color, Filter };
