'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { ArrowLeft, Loader2, PackageSearch } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useOrderStore, type Order } from '@/store/useOrderStore';
import { toast } from 'sonner';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Client({
  signedIn,
  initialOrder,
  orderId,
}: {
  signedIn: boolean;
  initialOrder: Order | null;
  orderId: string;
}) {
  const t = useTranslations('ORDER');
  const locale = useLocale();
  const router = useRouter();
  const cancelOrderAction = useOrderStore(s => s.cancelOrder);
  const [order, setOrder] = useState<Order | null>(initialOrder);
  const [cancelling, setCancelling] = useState(false);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (!signedIn) {
    return (
      <section className='container py-16'>
        <h1 className='font-serif text-4xl md:text-5xl'>{t('TITLE')}</h1>
        <div className='py-24 text-center'>
          <PackageSearch className='mx-auto h-10 w-10 text-muted-foreground/40' />
          <p className='mt-6 font-serif text-2xl'>{t('SIGN_IN_TITLE')}</p>
          <Button asChild variant='luxe' size='lg' className='mt-8'>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/orders/${orderId}`)}`}
            >
              {t('SIGN_IN')}
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className='container py-16'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => router.push('/orders')}
          className='gap-2'
        >
          <ArrowLeft className='h-4 w-4' /> {t('BACK')}
        </Button>
        <div className='py-24 text-center'>
          <PackageSearch className='mx-auto h-10 w-10 text-muted-foreground/40' />
          <p className='mt-6 font-serif text-2xl'>{t('NOT_FOUND')}</p>
        </div>
      </section>
    );
  }

  const handleCancel = async () => {
    if (!confirm(t('CANCEL_CONFIRM'))) return;
    setCancelling(true);
    try {
      await cancelOrderAction(order._id);
      setOrder({ ...order, orderStatus: 'cancelled' });
      toast.success(t('CANCEL_SUCCESS'));
    } catch {
      toast.error(t('CANCEL_ERROR'));
    } finally {
      setCancelling(false);
    }
  };

  const statusClass =
    STATUS_STYLES[order.orderStatus] ?? 'bg-muted text-muted-foreground';
  const subtotal = order.totalAmount - order.shippingCost;

  return (
    <section className='container py-12'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => router.push('/orders')}
        className='gap-2'
      >
        <ArrowLeft className='h-4 w-4' /> {t('BACK')}
      </Button>

      <div className='mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
            {t('ORDER_LABEL')}
          </p>
          <h1 className='mt-2 font-serif text-3xl md:text-4xl break-all'>
            #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            {t('PLACED')} {formatDate(order.createdAt)}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-luxe ${statusClass}`}
          >
            {order.orderStatus}
          </span>
          {order.orderStatus === 'pending' && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleCancel}
              disabled={cancelling}
              className='rounded-none'
            >
              {cancelling ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                t('CANCEL')
              )}
            </Button>
          )}
        </div>
      </div>

      <div className='mt-12 grid gap-12 lg:grid-cols-[1fr_360px]'>
        <div className='space-y-10'>
          <div>
            <h2 className='text-xs tracking-luxe uppercase text-foreground'>
              {t('ITEMS')}
            </h2>
            <ul className='mt-4 divide-y divide-border border-y border-border'>
              {order.items.map(it => {
                const price = it.price ?? 0;
                const image = it.product?.images?.[0];
                return (
                  <li key={it._id} className='flex gap-6 py-6'>
                    <div className='relative aspect-[4/5] w-24 shrink-0 bg-secondary/50'>
                      {image && (
                        <Image
                          src={image}
                          alt={it.product?.name ?? ''}
                          fill
                          sizes='96px'
                          className='object-cover'
                        />
                      )}
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <Link
                        href={`/product/${it.product?.slug}`}
                        className='font-serif text-lg hover:text-gold'
                      >
                        {it.product?.name}
                      </Link>
                      <p className='mt-1 text-xs tracking-luxe uppercase text-muted-foreground'>
                        {it.color?.name}
                      </p>
                      <p className='mt-2 text-sm text-muted-foreground'>
                        {t('QTY')} {it.quantity}
                      </p>
                    </div>
                    <p className='text-sm'>
                      ${(price * it.quantity).toFixed(0)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className='grid gap-8 sm:grid-cols-2'>
            <div>
              <h2 className='text-xs tracking-luxe uppercase text-foreground'>
                {t('SHIPPING_ADDRESS')}
              </h2>
              <div className='mt-4 space-y-1 text-sm text-muted-foreground'>
                <p className='text-foreground'>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.flatHouse}</p>
                <p>{order.shippingAddress.area}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.pinCode}
                </p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
            <div>
              <h2 className='text-xs tracking-luxe uppercase text-foreground'>
                {t('PAYMENT')}
              </h2>
              <div className='mt-4 space-y-1 text-sm text-muted-foreground'>
                <p className='text-foreground capitalize'>
                  {order.paymentMethod}
                </p>
                <p className='capitalize'>
                  {t('STATUS_LABEL')} {order.paymentStatus}
                </p>
                {order.trackingNumber && (
                  <p>
                    {t('TRACKING')}{' '}
                    <span className='text-foreground'>
                      {order.trackingNumber}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className='bg-secondary/50 p-8 lg:sticky lg:top-32 lg:h-fit'>
          <h2 className='font-serif text-2xl'>{t('SUMMARY')}</h2>
          <dl className='mt-6 space-y-2 text-sm'>
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>{t('SUBTOTAL')}</dt>
              <dd>${subtotal.toFixed(0)}</dd>
            </div>
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>{t('SHIPPING')}</dt>
              <dd>
                {order.shippingCost === 0
                  ? t('COMPLIMENTARY')
                  : `$${order.shippingCost.toFixed(0)}`}
              </dd>
            </div>
            <div className='mt-3 flex justify-between border-t border-border pt-3 font-serif text-lg'>
              <dt>{t('TOTAL')}</dt>
              <dd>${order.totalAmount.toFixed(0)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
