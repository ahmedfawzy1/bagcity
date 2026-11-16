'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Logo({ className = '' }: { className?: string }) {
  const t = useTranslations('BRAND');
  return (
    <Link
      href='/'
      className={`group inline-flex flex-col items-center leading-none ${className}`}
    >
      <span className='text-2xl tracking-tight text-foreground'>
        {t('NAME')}
      </span>
      <span className='mt-0.5 text-[10px] tracking-luxe text-muted-foreground uppercase'>
        {t('TAGLINE')}
      </span>
    </Link>
  );
}
