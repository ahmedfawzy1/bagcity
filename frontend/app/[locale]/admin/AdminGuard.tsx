'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/Admin/Dashboard/Sidebar';

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='flex h-dvh items-center justify-center bg-background'>
        <div className='h-10 w-10 animate-spin rounded-full border-2 border-border border-t-gold' />
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className='flex h-dvh bg-muted/30'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
        <div className='mx-auto w-full h-full px-4 md:px-8 py-6 md:py-10'>
          {children}
        </div>
      </main>
    </div>
  );
}
