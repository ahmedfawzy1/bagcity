'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/store/useOrderStore';
import { toast } from 'react-hot-toast';
import OrderDetailsModal from '@/components/Admin/Orders/OrderDetailsModal';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminOrders,
  useUpdateOrderStatus,
  type AdminOrderStatus,
} from '@/hooks/admin/use-admin-orders';

type OrderStatus = Order['orderStatus'] | 'all';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  delivered: { bg: '#dcfce7', color: '#15803d' },
  processing: { bg: '#dbeafe', color: '#1d4ed8' },
  shipped: { bg: '#ede9fe', color: '#6d28d9' },
  pending: { bg: '#fef3c7', color: '#a16207' },
  cancelled: { bg: '#fee2e2', color: '#b91c1c' },
};

export default function OrdersPage() {
  const t = useTranslations('ADMIN_ORDERS');
  const locale = useLocale();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<OrderStatus>('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ORDER_STATUS = [
    { value: 'all' as const, label: t('ALL') },
    { value: 'pending' as const, label: t('PENDING') },
    { value: 'processing' as const, label: t('PROCESSING') },
    { value: 'shipped' as const, label: t('SHIPPED') },
    { value: 'delivered' as const, label: t('DELIVERED') },
    { value: 'cancelled' as const, label: t('CANCELLED') },
  ];

  const PAYMENT_METHODS = [
    { value: 'all', label: t('ALL') },
    { value: 'card', label: t('CARD') },
    { value: 'cod', label: t('COD') },
  ];

  const ordersQuery = useAdminOrders({
    search,
    status,
    paymentMethod,
    startDate,
    endDate,
    page,
    limit,
  });

  const orders = ordersQuery.data?.data ?? [];
  const totalPages = ordersQuery.data?.totalPages ?? 1;
  const totalCount = ordersQuery.data?.total ?? orders.length;
  const loading = ordersQuery.isPending;
  const error = ordersQuery.isError ? t('FETCH_ERROR') : '';

  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'all') return;
    updateStatus.mutate(
      { orderId, status: newStatus as AdminOrderStatus },
      {
        onSuccess: () => toast.success(t('STATUS_UPDATED')),
        onError: () => toast.error(t('STATUS_UPDATE_ERROR')),
      },
    );
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleReset = () => {
    setSearch('');
    setStatus('all');
    setPaymentMethod('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const customerName = (order: Order) =>
    order.shippingAddress?.name ||
    `${order.customer?.first_name ?? ''} ${order.customer?.last_name ?? ''}`.trim() ||
    '—';

  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>{t('TITLE')}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            {loading
              ? t('LOADING')
              : `${totalCount} ${totalCount === 1 ? t('ORDER') : t('ORDERS')}`}
          </p>
        </div>
      </header>

      <div className='rounded-2xl border border-border bg-background p-5 shadow-soft'>
        <div className='grid gap-4 md:grid-cols-12'>
          <div className='md:col-span-5'>
            <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>
              {t('SEARCH')}
            </label>
            <Input
              placeholder={t('SEARCH_PLACEHOLDER')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className='md:col-span-3'>
            <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>
              {t('ORDER_STATUS')}
            </label>
            <Select
              value={status}
              onValueChange={(v: OrderStatus) => setStatus(v)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('ALL')} />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='md:col-span-4'>
            <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>
              {t('PAYMENT_METHOD')}
            </label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={t('ALL')} />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map(m => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='md:col-span-4'>
            <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>
              {t('START_DATE')}
            </label>
            <Input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className='md:col-span-4'>
            <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>
              {t('END_DATE')}
            </label>
            <Input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <div className='md:col-span-4 flex items-end gap-2'>
            <Button variant='outline' onClick={handleReset} className='flex-1'>
              {t('RESET')}
            </Button>
          </div>
        </div>
      </div>

      <div className='overflow-hidden rounded-2xl border border-border bg-background shadow-soft'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-border bg-muted/40 text-start text-xs uppercase tracking-wider text-muted-foreground'>
                <th className='px-5 py-3 font-semibold'>{t('COL_INVOICE')}</th>
                <th className='px-5 py-3 font-semibold'>{t('COL_DATE')}</th>
                <th className='px-5 py-3 font-semibold'>{t('COL_CUSTOMER')}</th>
                <th className='px-5 py-3 font-semibold'>{t('COL_METHOD')}</th>
                <th className='px-5 py-3 font-semibold text-end'>
                  {t('COL_AMOUNT')}
                </th>
                <th className='px-5 py-3 font-semibold'>{t('COL_STATUS')}</th>
                <th className='px-5 py-3 font-semibold text-end'>
                  {t('COL_ACTION')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className='border-b border-border last:border-0'>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className='px-5 py-4'>
                        <Skeleton className='h-4 w-full' />
                      </td>
                    ))}
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className='px-5 py-12 text-center text-sm text-destructive'
                  >
                    {error}
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className='px-5 py-16 text-center'>
                    <p className='text-base font-semibold text-foreground'>
                      {t('NONE_FOUND_TITLE')}
                    </p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {t('NONE_FOUND_DESC')}
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const s = STATUS_STYLES[order.orderStatus] ?? {
                    bg: '#f3f4f6',
                    color: '#374151',
                  };
                  return (
                    <tr
                      key={order._id}
                      className='border-b border-border last:border-0 transition-colors hover:bg-muted/30'
                    >
                      <td className='px-5 py-4 font-mono text-xs text-foreground/80'>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className='px-5 py-4 text-xs text-muted-foreground'>
                        {new Date(order.createdAt).toLocaleString(locale, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className='px-5 py-4 font-medium text-foreground'>
                        {customerName(order)}
                      </td>
                      <td className='px-5 py-4 text-foreground/80'>
                        {order.paymentMethod === 'card' ? t('CARD') : t('COD')}
                      </td>
                      <td className='px-5 py-4 text-end font-semibold tabular-nums text-foreground'>
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className='px-5 py-4'>
                        <Select
                          value={order.orderStatus}
                          onValueChange={(value: OrderStatus) =>
                            handleStatusChange(order._id, value)
                          }
                        >
                          <SelectTrigger
                            className='w-32 h-8 rounded-full border-0 px-3 text-xs font-medium focus:ring-1 [&>svg]:opacity-60'
                            style={{ backgroundColor: s.bg, color: s.color }}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUS.filter(o => o.value !== 'all').map(
                              o => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className='px-5 py-4 text-end'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleViewOrder(order)}
                          className='h-8 px-3 text-xs'
                        >
                          <Eye className='me-1.5 h-3.5 w-3.5' />
                          {t('VIEW')}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className='flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3'>
          <span className='text-xs text-muted-foreground'>
            {t('PAGE_OF', { current: page, total: totalPages || 1 })}
          </span>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={page === 1 || loading}
              onClick={() => setPage(page - 1)}
              className='h-8'
            >
              <ChevronLeft className='me-1 h-3.5 w-3.5 rtl:rotate-180' />
              {t('PREVIOUS')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
              className={cn('h-8', page >= totalPages && 'opacity-60')}
            >
              {t('NEXT')}
              <ChevronRight className='ms-1 h-3.5 w-3.5 rtl:rotate-180' />
            </Button>
          </div>
        </div>
      </div>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
