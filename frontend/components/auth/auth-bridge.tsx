"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

const SYNCED_USER_KEY = "cart-synced-user";

export function AuthBridge() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const syncLocalCartToBackend = useCartStore((s) => s.syncLocalCartToBackend);
  const getCart = useCartStore((s) => s.getCart);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const clearWishlist = useWishlistStore((s) => s.clear);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && userId) {
      const lastSyncedUserId = localStorage.getItem(SYNCED_USER_KEY);
      (async () => {
        if (lastSyncedUserId !== userId) {
          await syncLocalCartToBackend();
          localStorage.setItem(SYNCED_USER_KEY, userId);
        }
        await getCart();
        await fetchWishlist();
      })();
      return;
    }

    if (status === "unauthenticated") {
      localStorage.removeItem(SYNCED_USER_KEY);
      clearWishlist();
    }
  }, [status, userId, syncLocalCartToBackend, getCart, fetchWishlist, clearWishlist]);

  return null;
}
