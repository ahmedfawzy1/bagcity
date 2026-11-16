"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("PRODUCT_CARD");
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const hydrated = useWishlistStore((s) => s.hasHydrated);
  const wished = hydrated && isInWishlist(product.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error(t("WISHLIST_SIGNIN"), {
        action: {
          label: t("SIGN_IN"),
          onClick: () =>
            router.push(`/login?callbackUrl=${encodeURIComponent("/wishlist")}`),
        },
      });
      return;
    }
    if (wished) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-smooth group-hover:scale-105"
        />
        <button
          onClick={handleToggle}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 text-foreground transition-smooth hover:bg-background hover:text-gold",
            wished && "text-gold",
          )}
          aria-label={t("TOGGLE_WISHLIST")}
        >
          <Heart className={cn("h-4 w-4", wished && "fill-gold")} />
        </button>
      </div>
      <div className="pt-4 text-center">
        <p className="text-[10px] tracking-luxe uppercase text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug">{product.name}</h3>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm">
          <span className="text-foreground">${product.price}</span>
        </div>
      </div>
    </Link>
  );
}
