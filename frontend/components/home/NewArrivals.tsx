'use client';

import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/product-card";
import type { Product as BackendProduct } from "@/app/types/product";
import { toUIProduct } from "@/lib/adapters";

export function NewArrivalsSection({ products }: { products: BackendProduct[] }) {
  const t = useTranslations('HOME');
  const newArrivals = products.slice(0, 4).map(toUIProduct);

  return (
    <section className="container pb-20 md:pb-28">
      <div className="mb-12 text-center">
        <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('NEW_ARRIVALS_EYEBROW')}</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('NEW_ARRIVALS_TITLE')}</h2>
      </div>
      <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {newArrivals.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
