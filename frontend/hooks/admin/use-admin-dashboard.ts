import { useQuery } from '@tanstack/react-query';
import {
  getSalesOverview,
  getOrderStatusOverview,
  getChartData,
  getRecentOrders,
} from '@/lib/dashboard';

export const adminDashboardKeys = {
  all: ['admin', 'dashboard'] as const,
  salesOverview: () => [...adminDashboardKeys.all, 'sales-overview'] as const,
  orderStatus: () => [...adminDashboardKeys.all, 'order-status'] as const,
  chartData: () => [...adminDashboardKeys.all, 'chart-data'] as const,
  recentOrders: (limit: number) => [...adminDashboardKeys.all, 'recent-orders', limit] as const,
};

const DASHBOARD_STALE_TIME = 60_000;

export function useSalesOverview() {
  return useQuery({
    queryKey: adminDashboardKeys.salesOverview(),
    queryFn: getSalesOverview,
    staleTime: DASHBOARD_STALE_TIME,
  });
}

export function useOrderStatus() {
  return useQuery({
    queryKey: adminDashboardKeys.orderStatus(),
    queryFn: getOrderStatusOverview,
    staleTime: DASHBOARD_STALE_TIME,
  });
}

export function useChartData() {
  return useQuery({
    queryKey: adminDashboardKeys.chartData(),
    queryFn: getChartData,
    staleTime: DASHBOARD_STALE_TIME,
  });
}

export function useRecentOrders(limit = 10) {
  return useQuery({
    queryKey: adminDashboardKeys.recentOrders(limit),
    queryFn: () => getRecentOrders(limit),
    staleTime: DASHBOARD_STALE_TIME,
  });
}
