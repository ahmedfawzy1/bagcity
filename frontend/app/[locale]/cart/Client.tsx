"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Minus, Plus, X, ArrowRight, Tag, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/useCartStore";

export default function Client() {
  const t = useTranslations('CART');
  const {
    items,
    total,
    discount,
    discountApplied,
    discountAmount,
    couponInfo,
    delivery,
    setDiscount,
    applyDiscount,
    removeDiscount,
    updateCart,
    removeFromCart,
  } = useCartStore();

  const subtotal = items.reduce(
    (sum, it) => sum + (it.product?.priceRange?.minVariantPrice ?? 0) * it.quantity,
    0,
  );
  const shipping = subtotal === 0 ? 0 : subtotal > 150 ? 0 : delivery;
  const grandTotal = (discountApplied ? total : subtotal) + shipping;

  return (
    <section className="container py-16">
      <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? t('ITEM') : t('ITEMS')}
      </p>

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-2xl">{t('EMPTY_TITLE')}</p>
          <p className="mt-3 text-muted-foreground">
            {t('EMPTY_DESC')}
          </p>
          <Button asChild variant="luxe" size="lg" className="mt-8">
            <Link href="/shop">{t('CONTINUE_SHOPPING')}</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-border border-y border-border">
            {items.map((it) => {
              const price = it.product?.priceRange?.minVariantPrice ?? 0;
              const image = it.product?.images?.[0];
              return (
                <li key={it._id} className="flex gap-6 py-6">
                  <div className="relative block aspect-[4/5] w-28 shrink-0 bg-secondary/50">
                    {image && (
                      <Image
                        src={image}
                        alt={it.product?.name ?? ""}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="font-serif text-lg">{it.product?.name}</p>
                        <p className="mt-1 text-xs tracking-luxe uppercase text-muted-foreground">
                          {it.color?.name}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(it._id)}
                        aria-label={t('REMOVE')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateCart(it._id, Math.max(1, it.quantity - 1))}
                          className="grid h-9 w-9 place-items-center hover:bg-secondary"
                          aria-label={t('DECREASE_QUANTITY')}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{it.quantity}</span>
                        <button
                          onClick={() => updateCart(it._id, it.quantity + 1)}
                          className="grid h-9 w-9 place-items-center hover:bg-secondary"
                          aria-label={t('INCREASE_QUANTITY')}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-serif text-lg">
                        ${(price * it.quantity).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="bg-secondary/50 p-8">
            <h2 className="font-serif text-2xl">{t('ORDER_SUMMARY')}</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('SUBTOTAL')}</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              {discountApplied && discountAmount > 0 && (
                <div className="flex justify-between text-green-700 dark:text-green-400">
                  <dt className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {couponInfo?.code ?? discount}
                    <button
                      type="button"
                      onClick={removeDiscount}
                      aria-label={t('REMOVE_DISCOUNT')}
                      className="ms-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </dt>
                  <dd>−${discountAmount.toFixed(2)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t('SHIPPING')}</dt>
                <dd>{shipping === 0 ? t('COMPLIMENTARY') : `$${shipping}`}</dd>
              </div>
              <div className="my-3 border-t border-border pt-3 flex justify-between font-serif text-lg">
                <dt>{t('TOTAL')}</dt>
                <dd>${grandTotal.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-3 flex items-center gap-1.5 text-xs tracking-luxe uppercase font-medium">
                <Tag className="h-3.5 w-3.5" /> {t('PROMO_CODE')}
              </p>
              {discountApplied ? (
                <div className="flex items-center justify-between rounded border border-green-600/40 bg-green-50 dark:bg-green-900/20 px-3 py-2 text-sm">
                  <span className="font-medium text-green-700 dark:text-green-400">
                    {couponInfo?.code ?? discount} {t('APPLIED')}
                  </span>
                  <button
                    type="button"
                    onClick={removeDiscount}
                    aria-label={t('REMOVE_DISCOUNT')}
                    className="text-green-700/70 hover:text-green-700 dark:text-green-400/70 dark:hover:text-green-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyDiscount()}
                    placeholder={t('ENTER_CODE')}
                    className="h-10 flex-1 bg-background text-sm uppercase placeholder:normal-case"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={applyDiscount}
                    disabled={!discount.trim()}
                    className="h-10 shrink-0"
                  >
                    {t('APPLY')}
                  </Button>
                </div>
              )}
            </div>

            {subtotal > 0 && subtotal < 150 && (
              <p className="mt-4 text-xs text-muted-foreground">
                {t('FREE_SHIPPING_HINT', { amount: `$${(150 - subtotal).toFixed(2)}` })}
              </p>
            )}
            <Button asChild variant="luxe" size="lg" className="mt-8 w-full">
              <Link href="/checkout">
                {t('CHECKOUT')} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Link
              href="/shop"
              className="mt-4 block text-center text-xs tracking-luxe uppercase text-muted-foreground hover:text-foreground"
            >
              {t('CONTINUE_SHOPPING')}
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
