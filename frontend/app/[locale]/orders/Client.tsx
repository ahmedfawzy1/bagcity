"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { PackageSearch } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import type { Order } from "@/store/useOrderStore";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Client({
  signedIn,
  initialOrders,
}: {
  signedIn: boolean;
  initialOrders: Order[];
}) {
  const t = useTranslations('ORDERS');
  const locale = useLocale();

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const STATUS_LABELS: Record<string, string> = {
    pending: t('STATUS_PENDING'),
    processing: t('STATUS_PROCESSING'),
    shipped: t('STATUS_SHIPPED'),
    delivered: t('STATUS_DELIVERED'),
    cancelled: t('STATUS_CANCELLED'),
  };

  if (!signedIn) {
    return (
      <section className="container py-16">
        <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
        <div className="py-24 text-center">
          <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-6 font-serif text-2xl">{t('SIGN_IN_TITLE')}</p>
          <Button asChild variant="luxe" size="lg" className="mt-8">
            <Link href={`/login?callbackUrl=${encodeURIComponent("/orders")}`}>{t('SIGN_IN')}</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (initialOrders.length === 0) {
    return (
      <section className="container py-16">
        <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
        <div className="py-24 text-center">
          <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-6 font-serif text-2xl">{t('EMPTY_TITLE')}</p>
          <p className="mt-3 text-muted-foreground">{t('EMPTY_DESC')}</p>
          <Button asChild variant="luxe" size="lg" className="mt-8">
            <Link href="/shop">{t('START_SHOPPING')}</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-16">
      <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {initialOrders.length} {initialOrders.length === 1 ? t('ORDER') : t('ORDERS_WORD')}
      </p>

      <ul className="mt-12 space-y-6">
        {initialOrders.map((order) => {
          const itemCount = order.items.reduce((s, it) => s + it.quantity, 0);
          const preview = order.items.slice(0, 3);
          const statusClass = STATUS_STYLES[order.orderStatus] ?? "bg-muted text-muted-foreground";
          const statusLabel = STATUS_LABELS[order.orderStatus] ?? order.orderStatus;

          return (
            <li key={order._id} className="border border-border bg-background">
              <div className="flex flex-col gap-3 border-b border-border bg-secondary/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs">
                  <div>
                    <p className="tracking-luxe uppercase text-muted-foreground">{t('PLACED')}</p>
                    <p className="mt-1 font-medium">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="tracking-luxe uppercase text-muted-foreground">{t('TOTAL')}</p>
                    <p className="mt-1 font-medium">${order.totalAmount.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="tracking-luxe uppercase text-muted-foreground">{t('ORDER_NUM')}</p>
                    <p className="mt-1 font-mono text-[11px]">{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-luxe ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                  <Button asChild variant="outline" size="sm" className="rounded-none">
                    <Link href={`/orders/${order._id}`}>{t('VIEW_ORDER')}</Link>
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 px-6 py-5">
                <div className="flex -space-x-2">
                  {preview.map((it) => {
                    const img = it.product?.images?.[0];
                    return (
                      <div
                        key={it._id}
                        className="relative aspect-square w-14 shrink-0 overflow-hidden border border-background bg-secondary/50"
                      >
                        {img && (
                          <Image
                            src={img}
                            alt={it.product?.name ?? ""}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        )}
                      </div>
                    );
                  })}
                  {order.items.length > preview.length && (
                    <div className="grid aspect-square w-14 place-items-center border border-background bg-secondary text-xs text-muted-foreground">
                      +{order.items.length - preview.length}
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {itemCount} {itemCount === 1 ? t('ITEM') : t('ITEMS')}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
