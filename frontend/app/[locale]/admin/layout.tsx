import type { Metadata } from 'next';
import generateSEO from '@/lib/seo';
import AdminGuard from './AdminGuard';

export const generateMetadata = async (): Promise<Metadata> => {
  return generateSEO({
    title: 'Admin Dashboard',
    description:
      'Internal BagCity admin console for managing products, orders, customers and storefront content.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  });
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
