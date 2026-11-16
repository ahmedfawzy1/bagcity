'use client';

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/product-card";
import type { Product as BackendProduct } from "@/app/types/product";
import { toUIProduct } from "@/lib/adapters";

export function BestsellersSection({ products }: { products: BackendProduct[] }) {
  const t = useTranslations('HOME');
  const bestsellers = products.slice(0, 4).map(toUIProduct);

  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">
              {t('BESTSELLERS_EYEBROW')}
            </p>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl">{t('BESTSELLERS_TITLE')}</h2>
          </div>
          <Link
            href="/shop"
            className="text-xs tracking-luxe uppercase text-foreground hover:text-gold transition-smooth"
          >
            {t('BESTSELLERS_VIEW_ALL')}
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
