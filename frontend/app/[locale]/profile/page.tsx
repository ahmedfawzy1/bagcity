import Client from './Client';
import generateSEO from '@/lib/seo';
import { getServerAuth } from '@/lib/server-auth';
import type { Address } from '@/lib/address';

export const dynamic = 'force-dynamic';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Your Profile & Saved Addresses',
    description:
      'Manage your BagCity profile, update personal details and edit your saved shipping and billing addresses.',
    alternates: {
      canonical: '/profile',
    },
    robots: {
      index: false,
      follow: false,
    },
  });
};

async function getServerAddresses(token: string): Promise<Address[]> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
  try {
    const res = await fetch(`${baseURL}/api/address`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return (await res.json()) as Address[];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
}

export default async function Page() {
  const auth = await getServerAuth();
  if (!auth) {
    return <Client signedIn={false} initialUser={null} initialAddresses={[]} />;
  }
  const addresses = await getServerAddresses(auth.token);
  return (
    <Client
      signedIn={true}
      initialUser={{
        id: auth.user.id,
        first_name: auth.user.first_name,
        last_name: auth.user.last_name,
        email: auth.user.email,
        phone: auth.user.phone,
      }}
      initialAddresses={addresses}
    />
  );
}
