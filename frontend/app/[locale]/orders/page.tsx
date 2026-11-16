import Client from './Client';
import generateSEO from '@/lib/seo';
import { getServerAuth } from '@/lib/server-auth';
import type { Order } from '@/store/useOrderStore';

export const dynamic = 'force-dynamic';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Your Orders & Order History',
    description:
      'View your BagCity order history, track shipments in transit and download invoices for previous purchases.',
    alternates: {
      canonical: '/orders',
    },
    robots: {
      index: false,
      follow: false,
    },
  });
};

async function getOrders(token: string): Promise<Order[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export default async function Page() {
  const auth = await getServerAuth();
  if (!auth) {
    return <Client signedIn={false} initialOrders={[]} />;
  }
  const orders = await getOrders(auth.token);
  return <Client signedIn={true} initialOrders={orders} />;
}
