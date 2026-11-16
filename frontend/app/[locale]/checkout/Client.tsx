'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  Lock,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Wallet,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCartStore } from '@/store/useCartStore';
import { useOrderStore } from '@/store/useOrderStore';
import { getAddresses, type Address } from '@/lib/address';
import { toast } from 'sonner';

type PaymentMethod = 'instapay' | 'vodafone';

const NEW_ADDRESS = '__new__';

export default function Client() {
  const t = useTranslations('CHECKOUT');
  const tMerchant = useTranslations('MERCHANT');
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const { items, clearCart, delivery, getCart } = useCartStore();
  const createOrder = useOrderStore(s => s.createOrder);

  const subtotal = items.reduce(
    (sum, it) =>
      sum + (it.product?.priceRange?.minVariantPrice ?? 0) * it.quantity,
    0,
  );
  const shipping = subtotal === 0 ? 0 : subtotal > 150 ? 0 : delivery;
  const total = subtotal + shipping;

  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('instapay');
  const [submitting, setSubmitting] = useState(false);

  const sessionUser = session?.user as
    | { first_name?: string; last_name?: string; phone?: string }
    | undefined;
  const blankForm = () => ({
    name: [sessionUser?.first_name, sessionUser?.last_name]
      .filter(Boolean)
      .join(' '),
    phone: sessionUser?.phone ?? '',
    flatHouse: '',
    area: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const formFromAddress = (a: Address) => ({
    name: a.name,
    phone: a.phone,
    flatHouse: a.flatHouse,
    area: a.area,
    city: a.city,
    state: a.state,
    pinCode: a.pinCode,
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState<string>(NEW_ADDRESS);
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    if (sessionStatus !== 'authenticated') return;
    getAddresses()
      .then(list => {
        setAddresses(list);
        if (list.length > 0) {
          setSelectedAddressId(list[0]._id);
          setForm(formFromAddress(list[0]));
        }
      })
      .catch(() => {
        // silent — user may simply have none
      });
  }, [sessionStatus]);

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
    if (id === NEW_ADDRESS) {
      setForm(blankForm());
      return;
    }
    const a = addresses.find(x => x._id === id);
    if (a) setForm(formFromAddress(a));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sessionStatus !== 'authenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/checkout')}`);
      return;
    }
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      // Refresh cart from backend so we always submit with populated color/product
      // IDs (locally persisted items may have a stale shape until getCart resolves).
      await getCart();
      const freshItems = useCartStore.getState().items;
      if (freshItems.length === 0) {
        toast.error(t('ORDER_ERROR'), {
          description: tMerchant('TRY_AGAIN'),
        });
        return;
      }

      const resolvedItems = freshItems.map(it => ({
        product: it.product._id,
        quantity: it.quantity,
        color: typeof it.color === 'object' ? it.color?._id : it.color,
        price: it.product?.priceRange?.minVariantPrice ?? 0,
      }));
      const missingColor = resolvedItems.some(it => !it.color || !it.product);
      if (missingColor) {
        toast.error(t('ORDER_ERROR'), {
          description: tMerchant('TRY_AGAIN'),
        });
        return;
      }
      const order = await createOrder({
        items: resolvedItems,
        shippingAddress: form,
        paymentMethod: 'cod',
        totalAmount: total,
        shippingCost: shipping,
      });

      setOrderId(order._id);
      setDone(true);
      await clearCart();
    } catch (err) {
      toast.error(t('ORDER_ERROR'), {
        description:
          err instanceof Error ? err.message : tMerchant('TRY_AGAIN'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className='container py-24 text-center'>
        <Loader2 className='mx-auto h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (sessionStatus !== 'authenticated') {
    return (
      <div className='container py-24 text-center'>
        <p className='font-serif text-2xl'>{t('SIGN_IN_TITLE')}</p>
        <p className='mt-3 text-sm text-muted-foreground'>
          {t('SIGN_IN_DESC')}
        </p>
        <Button asChild variant='luxe' size='lg' className='mt-8'>
          <Link href={`/login?callbackUrl=${encodeURIComponent('/checkout')}`}>
            {t('SIGN_IN')}
          </Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0 && !done) {
    return (
      <div className='container py-24 text-center'>
        <p className='font-serif text-2xl'>{t('EMPTY_TITLE')}</p>
        <Button asChild variant='luxe' size='lg' className='mt-8'>
          <Link href='/shop'>{t('SHOP_NOW')}</Link>
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className='container py-24'>
        <div className='mx-auto max-w-xl text-center'>
          <div className='mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent'>
            <CheckCircle2 className='h-8 w-8 text-gold' />
          </div>
          <h1 className='mt-6 font-serif text-4xl md:text-5xl'>
            {t('THANK_YOU')}
          </h1>
          <p className='mt-4 text-muted-foreground'>{t('ORDER_CONFIRMED')}</p>
          <div className='mt-10 border border-border bg-secondary/40 p-8 text-left rtl:text-right'>
            <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
              {t('ORDER_NUMBER')}
            </p>
            <p className='mt-1 text-2xl text-center break-all'>{orderId}</p>
            <p className='mt-6 text-sm text-muted-foreground'>
              {t('ESTIMATED_DELIVERY')}
            </p>
          </div>
          <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            <Button asChild variant='luxe' size='lg'>
              <Link href={`/orders/${orderId}`}>{t('VIEW_ORDER')}</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='rounded-none'
            >
              <Link href='/shop'>{t('CONTINUE_SHOPPING')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className='container py-12'>
      <h1 className='font-serif text-4xl md:text-5xl'>{t('TITLE')}</h1>

      <form
        onSubmit={handleSubmit}
        className='mt-12 grid gap-12 lg:grid-cols-[1fr_400px]'
      >
        <div className='space-y-12'>
          <div>
            <h2 className='text-xs tracking-luxe uppercase text-foreground'>
              {t('CONTACT')}
            </h2>
            <div className='mt-4'>
              <Label htmlFor='email'>{t('EMAIL')}</Label>
              <Input
                id='email'
                type='email'
                value={session?.user?.email ?? ''}
                readOnly
                className='mt-2 h-12 rounded-none bg-secondary/40'
              />
            </div>
          </div>

          <div>
            <div className='flex items-end justify-between gap-4'>
              <h2 className='text-xs tracking-luxe uppercase text-foreground'>
                {t('SHIPPING_ADDRESS')}
              </h2>
              {addresses.length > 0 && (
                <div className='w-56'>
                  <Select
                    value={selectedAddressId}
                    onValueChange={handleAddressSelect}
                  >
                    <SelectTrigger className='h-9 rounded-none text-xs'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map(a => (
                        <SelectItem key={a._id} value={a._id}>
                          {a.name} — {a.city}
                        </SelectItem>
                      ))}
                      <SelectItem value={NEW_ADDRESS}>
                        {t('USE_NEW_ADDRESS')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className='mt-4 grid gap-4 sm:grid-cols-2'>
              <div className='sm:col-span-2'>
                <Label htmlFor='name'>{t('FULL_NAME')}</Label>
                <Input
                  id='name'
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
              <div>
                <Label htmlFor='phone'>{t('PHONE')}</Label>
                <Input
                  id='phone'
                  type='tel'
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
              <div>
                <Label htmlFor='pinCode'>{t('POSTAL_CODE')}</Label>
                <Input
                  id='pinCode'
                  value={form.pinCode}
                  onChange={e => setForm({ ...form, pinCode: e.target.value })}
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
              <div className='sm:col-span-2'>
                <Label htmlFor='flatHouse'>{t('APARTMENT')}</Label>
                <Input
                  id='flatHouse'
                  value={form.flatHouse}
                  onChange={e =>
                    setForm({ ...form, flatHouse: e.target.value })
                  }
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
              <div className='sm:col-span-2'>
                <Label htmlFor='area'>{t('STREET')}</Label>
                <Input
                  id='area'
                  value={form.area}
                  onChange={e => setForm({ ...form, area: e.target.value })}
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
              <div>
                <Label htmlFor='city'>{t('CITY')}</Label>
                <Input
                  id='city'
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
              <div>
                <Label htmlFor='state'>{t('STATE')}</Label>
                <Input
                  id='state'
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value })}
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className='text-xs tracking-luxe uppercase text-foreground'>
              {t('PAYMENT')}
            </h2>
            <p className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
              <Lock className='h-3 w-3' /> {t('ENCRYPTED')}
            </p>

            <div className='mt-4 grid gap-3'>
              <div className='relative flex cursor-not-allowed items-center gap-4 border border-border bg-secondary/30 p-4 opacity-50'>
                <div className='grid h-4 w-4 shrink-0 place-items-center rounded-full border border-border'>
                  <div className='h-2 w-2 rounded-full' />
                </div>
                <CreditCard className='h-5 w-5 text-muted-foreground' />
                <div className='flex-1'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {t('CREDIT_CARD')}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {t('CREDIT_CARD_BRANDS')}
                  </p>
                </div>
                <span className='rounded border border-border px-2 py-0.5 text-[10px] tracking-luxe uppercase text-muted-foreground'>
                  {t('COMING_SOON')}
                </span>
              </div>

              <button
                type='button'
                onClick={() => setPayMethod('instapay')}
                className={`flex items-center gap-4 border p-4 text-left transition-colors ${
                  payMethod === 'instapay'
                    ? 'border-foreground bg-background'
                    : 'border-border hover:border-foreground/40'
                }`}
              >
                <div className='grid h-4 w-4 shrink-0 place-items-center rounded-full border border-foreground'>
                  {payMethod === 'instapay' && (
                    <div className='h-2 w-2 rounded-full bg-foreground' />
                  )}
                </div>
                <Smartphone className='h-5 w-5 shrink-0' />
                <div>
                  <p className='text-sm font-medium'>{t('INSTAPAY')}</p>
                  <p className='text-xs text-muted-foreground'>
                    {t('INSTAPAY_DESC')}
                  </p>
                </div>
              </button>

              <button
                type='button'
                onClick={() => setPayMethod('vodafone')}
                className={`flex items-center gap-4 border p-4 text-left transition-colors ${
                  payMethod === 'vodafone'
                    ? 'border-foreground bg-background'
                    : 'border-border hover:border-foreground/40'
                }`}
              >
                <div className='grid h-4 w-4 shrink-0 place-items-center rounded-full border border-foreground'>
                  {payMethod === 'vodafone' && (
                    <div className='h-2 w-2 rounded-full bg-foreground' />
                  )}
                </div>
                <Wallet className='h-5 w-5 shrink-0 text-red-600' />
                <div>
                  <p className='text-sm font-medium'>{t('VODAFONE')}</p>
                  <p className='text-xs text-muted-foreground'>
                    {t('VODAFONE_DESC')}
                  </p>
                </div>
              </button>
            </div>

            {payMethod === 'instapay' && (
              <div className='mt-4 border border-border bg-secondary/40 p-4 text-sm'>
                <p className='font-medium'>{t('INSTAPAY_TITLE')}</p>
                <p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
                  {t('INSTAPAY_INSTRUCTIONS')}
                </p>
                <div className='mt-3 space-y-1 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      {t('ACCOUNT_NAME')}
                    </span>
                    <span className='font-medium'>
                      {tMerchant('STORE_NAME')}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      {t('PHONE_IPA')}
                    </span>
                    <span className='font-medium'>01000000000</span>
                  </div>
                </div>
              </div>
            )}

            {payMethod === 'vodafone' && (
              <div className='mt-4 border border-border bg-secondary/40 p-4 text-sm'>
                <p className='font-medium'>{t('VODAFONE_TITLE')}</p>
                <p className='mt-2 text-muted-foreground text-xs leading-relaxed'>
                  {t('VODAFONE_INSTRUCTIONS')}
                </p>
                <div className='mt-3 space-y-1 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      {t('ACCOUNT_NAME')}
                    </span>
                    <span className='font-medium'>
                      {tMerchant('STORE_NAME')}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      {t('VODAFONE_NUMBER')}
                    </span>
                    <span className='font-medium text-red-600'>
                      01000000000
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            type='submit'
            variant='luxe'
            size='xl'
            className='w-full'
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <>
                {t('PLACE_ORDER')} · ${total.toFixed(0)}
              </>
            )}
          </Button>
        </div>

        <aside className='bg-secondary/50 p-8 lg:sticky lg:top-32 lg:h-fit'>
          <h2 className='font-serif text-2xl'>{t('ORDER_SUMMARY')}</h2>
          <ul className='mt-6 space-y-4'>
            {items.map(it => {
              const price = it.product?.priceRange?.minVariantPrice ?? 0;
              const image = it.product?.images?.[0];
              return (
                <li key={it._id} className='flex gap-4'>
                  <div className='relative aspect-square w-16 shrink-0 bg-background'>
                    {image && (
                      <Image
                        src={image}
                        alt={it.product?.name ?? ''}
                        fill
                        sizes='64px'
                        className='object-cover'
                      />
                    )}
                    <span className='absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-foreground text-[10px] text-background'>
                      {it.quantity}
                    </span>
                  </div>
                  <div className='flex-1 text-sm'>
                    <p className='font-medium'>{it.product?.name}</p>
                    <p className='text-xs text-muted-foreground'>
                      {it.color?.name}
                    </p>
                  </div>
                  <p className='text-sm'>${(price * it.quantity).toFixed(0)}</p>
                </li>
              );
            })}
          </ul>
          <dl className='mt-6 space-y-2 border-t border-border pt-6 text-sm'>
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>{t('SUBTOTAL')}</dt>
              <dd>${subtotal.toFixed(0)}</dd>
            </div>
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>{t('SHIPPING')}</dt>
              <dd>{shipping === 0 ? t('COMPLIMENTARY') : `$${shipping}`}</dd>
            </div>
            <div className='mt-3 flex justify-between border-t border-border pt-3 font-serif text-lg'>
              <dt>{t('TOTAL')}</dt>
              <dd>${total.toFixed(0)}</dd>
            </div>
          </dl>
        </aside>
      </form>
    </section>
  );
}
