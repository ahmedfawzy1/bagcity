import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { getSession } from 'next-auth/react';
import { Product } from '@/app/types/product';
import {
  getWishlistById,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from '@/lib/wishlist';

interface WishlistStore {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string, product?: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      fetchWishlist: async () => {
        const session = await getSession();
        const userId = session?.user?.id;
        if (!userId) return;

        set({ isLoading: true, error: null });
        try {
          const response = await getWishlistById(userId);
          set({ products: response?.products || [], isLoading: false });
        } catch (error: any) {
          set({
            error: error?.response?.data?.message || 'Failed to fetch wishlist',
            isLoading: false,
          });
        }
      },

      addToWishlist: async (productId: string, product?: Product) => {
        const previous = get().products;
        if (previous.some((p) => p._id === productId)) return;

        const stub = product ?? ({ _id: productId } as Product);
        set({ products: [...previous, stub], error: null });
        toast.success(product?.name ? `${product.name} saved to wishlist` : 'Saved to wishlist');

        const session = await getSession();
        const userId = session?.user?.id;
        if (!userId) return;

        try {
          await apiAddToWishlist(userId, productId);
          const response = await getWishlistById(userId);
          if (response?.products) set({ products: response.products });
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Failed to add to wishlist';
          set({ products: previous, error: message });
          toast.error(message);
        }
      },

      removeFromWishlist: async (productId: string) => {
        const previous = get().products;
        const removed = previous.find((p) => p._id === productId);
        if (!removed) return;

        set({ products: previous.filter((p) => p._id !== productId), error: null });
        toast.success(removed.name ? `${removed.name} removed from wishlist` : 'Removed from wishlist');

        const session = await getSession();
        const userId = session?.user?.id;
        if (!userId) return;

        try {
          await apiRemoveFromWishlist(userId, productId);
          const response = await getWishlistById(userId);
          if (response?.products) set({ products: response.products });
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Failed to remove from wishlist';
          set({ products: previous, error: message });
          toast.error(message);
        }
      },

      isInWishlist: (productId: string) => {
        return get().products.some((product) => product._id === productId);
      },

      clear: () => {
        set({ products: [], error: null });
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ products: state.products }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
