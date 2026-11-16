'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function Client() {
  const t = useTranslations('ABOUT');

  const values = [
    { title: t('VALUE_1_TITLE'), desc: t('VALUE_1_DESC') },
    { title: t('VALUE_2_TITLE'), desc: t('VALUE_2_DESC') },
    { title: t('VALUE_3_TITLE'), desc: t('VALUE_3_DESC') },
  ];

  return (
    <>
      <section className='gradient-hero'>
        <div className='container py-20 text-center md:py-28'>
          <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
            {t('EYEBROW')}
          </p>
          <h1 className='mt-4 font-serif text-5xl md:text-6xl text-balance'>
            {t('TITLE')}
          </h1>
          <p className='mx-auto mt-6 max-w-2xl text-muted-foreground'>
            {t('DESC')}
          </p>
        </div>
      </section>

      <section className='container py-20 md:py-28'>
        <div className='grid items-center gap-12 md:grid-cols-2'>
          <div className='relative aspect-[4/5] w-full overflow-hidden'>
            <Image
              src='/images/hero-bag.jpg'
              alt='BagCity atelier'
              fill
              sizes='(min-width: 768px) 50vw, 100vw'
              className='object-cover'
            />
          </div>
          <div>
            <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
              {t('CRAFT_EYEBROW')}
            </p>
            <h2 className='mt-3 font-serif text-4xl'>{t('CRAFT_TITLE')}</h2>
            <p className='mt-6 leading-relaxed text-muted-foreground'>
              {t('CRAFT_P1')}
            </p>
            <p className='mt-4 leading-relaxed text-muted-foreground'>
              {t('CRAFT_P2')}
            </p>
          </div>
        </div>
      </section>

      <section className='bg-accent/30 py-20 md:py-28'>
        <div className='container grid items-center gap-12 md:grid-cols-2'>
          <div className='md:order-2'>
            <div className='relative aspect-[4/5] w-full overflow-hidden'>
              <Image
                src='/images/bag-shoulder.jpg'
                alt='Quilted shoulder bag detail'
                fill
                sizes='(min-width: 768px) 50vw, 100vw'
                className='object-cover'
              />
            </div>
          </div>
          <div className='md:order-1'>
            <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
              {t('VALUES_EYEBROW')}
            </p>
            <h2 className='mt-3 font-serif text-4xl'>{t('VALUES_TITLE')}</h2>
            <ul className='mt-8 space-y-6'>
              {values.map(v => (
                <li key={v.title} className='border-l border-gold pl-5'>
                  <p className='font-serif text-xl'>{v.title}</p>
                  <p className='mt-1 text-muted-foreground'>{v.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className='container py-20 text-center'>
        <h2 className='font-serif text-4xl md:text-5xl'>{t('CTA_TITLE')}</h2>
        <p className='mx-auto mt-4 max-w-xl text-muted-foreground'>
          {t('CTA_DESC')}
        </p>
        <Button asChild variant='luxe' size='lg' className='mt-8'>
          <Link href='/shop'>{t('CTA_BUTTON')}</Link>
        </Button>
      </section>
    </>
  );
}
