import { Suspense } from 'react';
import Client from './Client';
import generateSEO from '@/lib/seo';
import type { Product, ProductsResponse } from '@/app/types/product';

export const revalidate = 3600;

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Shop All Bags – Totes, Crossbodies & Clutches',
    description:
      'Shop the full BagCity collection of hand-finished leather bags. Filter by category, color and price to find your next everyday carry or statement piece.',
    alternates: {
      canonical: '/shop',
    },
    robots: {
      index: true,
      follow: true,
    },
  });
};

async function getShopProducts(): Promise<Product[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/products?page=1&limit=50`, {
      next: { revalidate: 3600, tags: ['products'] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ProductsResponse;
    return data.data ?? [];
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return [];
  }
}

export default async function Page() {
  const products = await getShopProducts();

  return (
    <Suspense fallback={null}>
      <Client initialProducts={products} />
    </Suspense>
  );
}
