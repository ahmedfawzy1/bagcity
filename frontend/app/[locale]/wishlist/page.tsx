import Client from './Client';
import generateSEO from '@/lib/seo';
import { getServerAuth } from '@/lib/server-auth';
import type { Product } from '@/app/types/product';

export const dynamic = 'force-dynamic';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Your Wishlist',
    description:
      "Your saved BagCity pieces, ready when you are. Move favourites to your bag in one tap and never lose track of the bag you love.",
    alternates: {
      canonical: '/wishlist',
    },
    robots: {
      index: false,
      follow: false,
    },
  });
};

async function getWishlistProducts(
  userId: string,
  token: string,
): Promise<Product[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/wishlist/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products ?? [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export default async function Page() {
  const auth = await getServerAuth();
  if (!auth) {
    return <Client userId={null} initialProducts={[]} />;
  }
  const products = await getWishlistProducts(auth.userId, auth.token);
  return <Client userId={auth.userId} initialProducts={products} />;
}
