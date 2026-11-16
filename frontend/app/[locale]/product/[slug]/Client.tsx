"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Star, Truck, RefreshCw, Shield, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/product/product-card";
import { ProductActions } from "./product-actions";
import { ProductReviews } from "./product-reviews";
import { cn } from "@/lib/utils";
import type { Product as BackendProduct } from "@/app/types/product";
import { toUIProduct } from "@/lib/adapters";

export default function Client({
  product: backendProduct,
  related: backendRelated,
}: {
  product: BackendProduct;
  related: BackendProduct[];
}) {
  const t = useTranslations('PRODUCT');
  const product = useMemo(() => toUIProduct(backendProduct), [backendProduct]);
  const related = useMemo(
    () => backendRelated.map(toUIProduct),
    [backendRelated],
  );
  const images = backendProduct.images ?? [];
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <div className="container py-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            {t('HOME')}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/shop" className="hover:text-foreground">
            {t('SHOP')}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="container grid gap-12 pb-20 md:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
            {images[selectedImage] && (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square overflow-hidden bg-secondary/40 ring-1 transition-smooth ${
                    selectedImage === i ? 'ring-gold' : 'ring-border hover:ring-gold'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:pl-6 lg:pl-12">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">
            {product.category}
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("h-4 w-4", i < Math.round(product.rating) && "fill-current")}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              {product.rating} · {product.reviews} {t('REVIEWS_LABEL')}
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-3xl text-foreground">${product.price}</span>
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <ProductActions product={backendProduct} />

          <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-gold" /> {t('SHIPPING_PERK')}
            </li>
            <li className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-gold" /> {t('RETURNS_PERK')}
            </li>
            <li className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-gold" /> {t('GUARANTEE_PERK')}
            </li>
          </ul>
        </div>
      </section>

      <ProductReviews productId={backendProduct._id} />

      {related.length > 0 && (
        <section className="container py-20">
          <h2 className="mb-12 text-center font-serif text-3xl md:text-4xl">{t('YOU_MAY_ALSO_LOVE')}</h2>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
