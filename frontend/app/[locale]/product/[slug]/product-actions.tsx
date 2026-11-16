"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import type { Product as BackendProduct } from "@/app/types/product";
import { cn } from "@/lib/utils";

export function ProductActions({ product }: { product: BackendProduct }) {
  const t = useTranslations('PRODUCT');
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const addToCart = useCartStore((s) => s.addToCart);
  const {
    products: wishlistProducts,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();
  const wishlistHydrated = useWishlistStore((s) => s.hasHydrated);

  const variants = product.variants ?? [];
  const colorVariants = variants.filter((v) => v.color);
  const [variantId, setVariantId] = useState<string>(colorVariants[0]?._id ?? "");
  const [qty, setQty] = useState(1);

  const currentVariant = variants.find((v) => v._id === variantId);
  const wished = wishlistHydrated && isInWishlist(product._id);

  useEffect(() => {
    if (userId && wishlistProducts.length === 0) {
      fetchWishlist();
    }
  }, [userId, fetchWishlist, wishlistProducts.length]);

  const handleAdd = async () => {
    if (!currentVariant?.color) {
      toast.error(t('SELECT_COLOR_ERROR'));
      return;
    }
    await addToCart({
      _id: `${product._id}-${currentVariant._id}`,
      product: {
        _id: product._id,
        name: product.name,
        priceRange: {
          minVariantPrice: product.priceRange.minVariantPrice,
          maxVariantPrice: product.priceRange.maxVariantPrice,
        },
        images: product.images,
      },
      variantId: currentVariant._id,
      color: {
        _id: currentVariant.color._id,
        name: currentVariant.color.name,
        hexCode: currentVariant.color.hexCode,
      },
      quantity: qty,
    });
    toast.success(`${product.name} ${t('ADD_TO_BAG')}`, {
      description: `${currentVariant.color.name} · Quantity ${qty}`,
    });
  };

  const handleWishlistToggle = async () => {
    if (!userId) {
      toast.error(t('SIGN_IN_WISHLIST'));
      return;
    }
    if (wished) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id, product);
    }
  };

  return (
    <>
      <div className="mt-8">
        <p className="text-xs tracking-luxe uppercase text-foreground">
          {t('COLOR')}{" "}
          <span className="text-muted-foreground normal-case tracking-normal">
            {currentVariant?.color?.name ?? "—"}
          </span>
        </p>
        <div className="mt-3 flex gap-3">
          {colorVariants.map((v) => (
            <button
              key={v._id}
              onClick={() => setVariantId(v._id)}
              aria-label={v.color?.name}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-smooth",
                variantId === v._id
                  ? "border-gold ring-2 ring-gold/30 ring-offset-2 ring-offset-background"
                  : "border-border",
              )}
              style={{ backgroundColor: v.color?.hexCode }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-stretch gap-3">
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-12 place-items-center hover:bg-secondary"
            aria-label={t('DECREASE_QUANTITY')}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="grid h-12 w-12 place-items-center hover:bg-secondary"
            aria-label={t('INCREASE_QUANTITY')}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <Button variant="luxe" size="lg" className="flex-1" onClick={handleAdd}>
          {t('ADD_TO_BAG')}
        </Button>
        <Button
          variant="outlineLuxe"
          size="lg"
          onClick={handleWishlistToggle}
          aria-label={t('WISHLIST_LABEL')}
          className="px-4"
        >
          <Heart className={cn("h-4 w-4", wished && "fill-gold text-gold")} />
        </Button>
      </div>
    </>
  );
}
