import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number | null;
  usedCount: number;
  createdAt: string;
}

export type CouponFormState = Omit<Coupon, '_id' | 'usedCount' | 'createdAt'>;

export const couponKeys = {
  all: ['admin', 'coupons'] as const,
  list: () => [...couponKeys.all, 'list'] as const,
};

export function useCoupons() {
  return useQuery({
    queryKey: couponKeys.list(),
    queryFn: async (): Promise<Coupon[]> => {
      const res = await axiosInstance.get('/coupons');
      return res.data;
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coupon: CouponFormState) => axiosInstance.post('/coupons', coupon),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: couponKeys.all }),
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponFormState }) =>
      axiosInstance.put(`/coupons/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: couponKeys.all }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/coupons/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: couponKeys.all }),
  });
}
