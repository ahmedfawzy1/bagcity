'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function BrandStorySection() {
  const t = useTranslations('HOME');

  return (
    <section className='container py-20 md:py-28'>
      <div className='grid items-center gap-12 md:grid-cols-2'>
        <div className='relative aspect-[4/5] w-full overflow-hidden'>
          <Image
            src='/images/bag-crossbody.jpg'
            alt='Amélie blush crossbody'
            fill
            sizes='(min-width: 768px) 50vw, 100vw'
            className='object-cover'
            loading='eager'
          />
        </div>
        <div>
          <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
            {t('BRAND_EYEBROW')}
          </p>
          <h2 className='mt-3 font-serif text-4xl md:text-5xl'>
            {t('BRAND_TITLE')}
          </h2>
          <p className='mt-6 leading-relaxed text-muted-foreground'>
            {t('BRAND_DESC')}
          </p>
          <div className='mt-8'>
            <Button asChild variant='outlineLuxe' size='lg'>
              <Link href='/about'>{t('BRAND_CTA')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
