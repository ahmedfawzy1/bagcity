import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

export interface Admin {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
}

export interface NewAdminPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export const adminStaffKeys = {
  all: ['admin', 'staff'] as const,
  list: () => [...adminStaffKeys.all, 'list'] as const,
};

export function useStaff() {
  return useQuery({
    queryKey: adminStaffKeys.list(),
    queryFn: async (): Promise<Admin[]> => {
      const res = await axiosInstance.get('/admins');
      return res.data;
    },
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: NewAdminPayload) => axiosInstance.post('/admins', payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminStaffKeys.all }),
  });
}

export function usePromoteToAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => axiosInstance.post('/admins/by-email', { email }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminStaffKeys.all }),
  });
}

export function useRemoveAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/admins/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminStaffKeys.all }),
  });
}
