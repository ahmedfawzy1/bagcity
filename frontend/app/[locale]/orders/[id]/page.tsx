import Client from './Client';
import generateSEO from '@/lib/seo';
import { getServerAuth } from '@/lib/server-auth';
import type { Order } from '@/store/useOrderStore';

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return generateSEO({
    title: 'Order Details & Tracking',
    description:
      'View the items, status and shipping details for this BagCity order.',
    alternates: {
      canonical: `/orders/${id}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  });
};

async function getOrder(id: string, token: string): Promise<Order | null> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const auth = await getServerAuth();
  if (!auth) {
    return <Client signedIn={false} initialOrder={null} orderId={id} />;
  }
  const order = await getOrder(id, auth.token);
  return <Client signedIn={true} initialOrder={order} orderId={id} />;
}
