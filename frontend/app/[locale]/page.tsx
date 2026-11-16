import Client from './Client';
import generateSEO from '@/lib/seo';
import type { Product, ProductsResponse, BestSellersResponse } from '@/app/types/product';
import type { Review, ReviewResponse } from '@/app/types/review';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Premium Leather Bags – Totes, Crossbodies & Backpacks',
    description:
      "Discover BagCity's hand-finished leather bags — totes, crossbodies, clutches and backpacks crafted from vegetable-tanned Italian leather. Complimentary worldwide shipping over $150.",
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
    },
  });
};

async function getNewArrivals(): Promise<Product[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/products?page=1&limit=4&sort=createdAt&order=desc`, {
      next: { revalidate: 3600, tags: ['products'] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ProductsResponse;
    return data.data ?? [];
  } catch {
    return [];
  }
}

async function getBestsellers(): Promise<Product[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/products/bestsellers`, {
      next: { revalidate: 3600, tags: ['products'] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as BestSellersResponse;
    return (data.data ?? []).slice(0, 4);
  } catch {
    return [];
  }
}

async function getReviews(): Promise<Review[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/reviews?page=1&limit=6`, {
      next: { revalidate: 3600, tags: ['reviews'] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ReviewResponse;
    return data.reviews ?? [];
  } catch {
    return [];
  }
}

export default async function page() {
  const [newArrivals, bestsellersRaw, reviews] = await Promise.all([
    getNewArrivals(),
    getBestsellers(),
    getReviews(),
  ]);

  // Fall back to newest products if no bestsellers data (no delivered orders yet)
  const bestsellers = bestsellersRaw.length > 0 ? bestsellersRaw : newArrivals;

  return <Client newArrivals={newArrivals} bestsellers={bestsellers} reviews={reviews} />;
}
