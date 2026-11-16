'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order } from '@/store/useOrderStore';
import { formatDate } from '@/lib/utils';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  const t = useTranslations('ADMIN_ORDER_DETAILS');
  const tStatus = useTranslations('ADMIN_ORDERS');

  if (!order) return null;

  const statusLabel = (status: string) => {
    const key = status.toUpperCase();
    const known = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    return known.includes(key)
      ? tStatus(key as 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED')
      : status;
  };

  const paymentMethodLabel = (method: string) => {
    if (method === 'card') return tStatus('CARD');
    if (method === 'cod') return tStatus('COD');
    return method;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold tracking-tight'>
            {t('TITLE')}
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-8'>
          {order.customer && (
            <div>
              <h3 className='text-lg font-semibold mb-3'>
                {t('CUSTOMER_INFO')}
              </h3>
              <div className='grid grid-cols-2 gap-2 text-sm'>
                <span className='font-medium text-muted-foreground'>{t('NAME')}</span>
                <span>
                  {order.customer.first_name} {order.customer.last_name}
                </span>
                <span className='font-medium text-muted-foreground'>
                  {t('EMAIL')}
                </span>
                <span className='break-all text-muted-foreground'>
                  {order.customer.email}
                </span>
                <span className='font-medium text-muted-foreground'>
                  {t('CUSTOMER_ID')}
                </span>
                <span className='break-all text-gray-600'>
                  {order.customer._id}
                </span>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div>
              <h3 className='text-lg font-semibold mb-3'>{t('ORDER_INFO')}</h3>
              <div className='space-y-1 text-sm'>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('ORDER_ID')}
                  </span>{' '}
                  <span className='break-all'>{order._id}</span>
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('DATE')}
                  </span>{' '}
                  {formatDate(order.createdAt)}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('STATUS')}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                      order.orderStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {statusLabel(order.orderStatus)}
                  </span>
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('PAYMENT_METHOD')}
                  </span>{' '}
                  {paymentMethodLabel(order.paymentMethod)}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('PAYMENT_STATUS')}
                  </span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                      order.paymentStatus === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentMethod === 'card' && order.paymentDetails && (
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      {t('CARD')}
                    </span>{' '}
                    {t('CARD_ENDING', {
                      type: order.paymentDetails.cardType,
                      last4: order.paymentDetails.last4,
                    })}
                  </div>
                )}
                {order.trackingNumber && (
                  <div>
                    <span className='font-medium text-muted-foreground'>
                      {t('TRACKING')}
                    </span>{' '}
                    {order.trackingNumber}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-3'>{t('SHIPPING_ADDRESS')}</h3>
              <div className='space-y-1 text-sm'>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('NAME')}
                  </span>{' '}
                  {order.shippingAddress.name}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('PHONE')}
                  </span>{' '}
                  {order.shippingAddress.phone}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('ADDRESS')}
                  </span>{' '}
                  {order.shippingAddress.flatHouse},{' '}
                  {order.shippingAddress.area}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('CITY')}
                  </span>{' '}
                  {order.shippingAddress.city}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('STATE')}
                  </span>{' '}
                  {order.shippingAddress.state}
                </div>
                <div>
                  <span className='font-medium text-muted-foreground'>
                    {t('POSTAL')}
                  </span>{' '}
                  {order.shippingAddress.pinCode}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-3'>{t('ITEMS')}</h3>
            <div className='space-y-4'>
              {order.items.map(item => (
                <div
                  key={item._id}
                  className='flex items-center gap-4 p-4 border rounded-lg bg-gray-50'
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className='w-20 h-20 object-cover rounded'
                    width={80}
                    height={80}
                  />
                  <div className='flex-1'>
                    <h4 className='font-medium'>{item.product.name}</h4>
                    <p className='text-xs text-muted-foreground'>
                      {t('COLOR', { color: item.color.name })}
                    </p>
                    <p className='text-xs'>{t('QUANTITY', { qty: item.quantity })}</p>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-base'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {t('EACH', { price: item.price.toFixed(2) })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='border-t pt-4 space-y-2'>
            <div className='flex justify-between items-center text-sm'>
              <span className='font-medium text-muted-foreground'>
                {t('SUBTOTAL')}
              </span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center text-sm'>
              <span className='font-medium text-muted-foreground'>
                {t('SHIPPING_LABEL')}
              </span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className='flex justify-between items-center font-bold text-lg mt-2'>
              <span>{t('TOTAL')}</span>
              <span>
                ${(order.totalAmount + order.shippingCost).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
