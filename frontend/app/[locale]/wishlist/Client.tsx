"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, X, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import type { Product as BackendProduct } from "@/app/types/product";

export default function Client({
  userId,
  initialProducts,
}: {
  userId: string | null;
  initialProducts: BackendProduct[];
}) {
  const t = useTranslations('WISHLIST');
  const [products, setProducts] = useState<BackendProduct[]>(initialProducts);
  const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    useWishlistStore.setState({ products: initialProducts, isLoading: false });
    return useWishlistStore.subscribe((s) => setProducts(s.products));
  }, [initialProducts]);

  if (!userId) {
    return (
      <section className="container py-16">
        <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
        <div className="py-24 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-6 font-serif text-2xl">{t('SIGN_IN_TITLE')}</p>
          <p className="mt-3 text-muted-foreground">
            {t('SIGN_IN_DESC')}
          </p>
          <Button asChild variant="luxe" size="lg" className="mt-8">
            <Link href={`/login?callbackUrl=${encodeURIComponent("/wishlist")}`}>{t('SIGN_IN')}</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-16">
      <h1 className="font-serif text-4xl md:text-5xl">{t('TITLE')}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {products.length} {products.length === 1 ? t('PIECE') : t('PIECES')} {t('SAVED')}
      </p>

      {products.length === 0 ? (
        <div className="py-24 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-6 font-serif text-2xl">{t('EMPTY_TITLE')}</p>
          <p className="mt-3 text-muted-foreground">
            {t('EMPTY_DESC')}
          </p>
          <Button asChild variant="luxe" size="lg" className="mt-8">
            <Link href="/shop">{t('EXPLORE')}</Link>
          </Button>
        </div>
      ) : (
        <>
          <ul className="mt-12 divide-y divide-border border-y border-border">
            {products.map((product) => {
              const price = product.priceRange?.minVariantPrice ?? 0;
              const firstVariant = product.variants?.find((v) => v.color);
              const firstImage = product.images?.[0];

              return (
                <li key={product._id} className="flex gap-6 py-6">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative block aspect-[4/5] w-28 shrink-0 bg-secondary/50"
                  >
                    {firstImage && (
                      <Image
                        src={firstImage}
                        alt={product.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-serif text-lg hover:text-gold"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs tracking-luxe uppercase text-muted-foreground">
                          {product.category?.name}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <span className="text-foreground">${price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        aria-label={t('REMOVE')}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                      <Button
                        variant="luxe"
                        size="sm"
                        disabled={!firstVariant?.color}
                        onClick={async () => {
                          if (!firstVariant?.color) return;
                          await addToCart({
                            _id: `${product._id}-${firstVariant._id}`,
                            product: {
                              _id: product._id,
                              name: product.name,
                              priceRange: {
                                minVariantPrice: product.priceRange.minVariantPrice,
                                maxVariantPrice: product.priceRange.maxVariantPrice,
                              },
                              images: product.images,
                            },
                            variantId: firstVariant._id,
                            color: {
                              _id: firstVariant.color._id,
                              name: firstVariant.color.name,
                              hexCode: firstVariant.color.hexCode,
                            },
                            quantity: 1,
                          });
                          removeFromWishlist(product._id);
                        }}
                        className="gap-1.5"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {t('MOVE_TO_BAG')}
                      </Button>
                      <Link
                        href={`/product/${product.slug}`}
                        className="text-xs tracking-luxe uppercase text-muted-foreground hover:text-foreground transition-smooth"
                      >
                        {t('VIEW_DETAILS')}
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/shop"
              className="text-xs tracking-luxe uppercase text-muted-foreground hover:text-foreground transition-smooth"
            >
              {t('CONTINUE_SHOPPING')}
            </Link>
            <Button asChild variant="luxe" size="lg">
              <Link href="/cart">
                {t('GO_TO_BAG')} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
