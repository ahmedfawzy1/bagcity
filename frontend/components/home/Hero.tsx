'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const t = useTranslations('HOME');

  return (
    <section className='relative overflow-hidden gradient-hero'>
      <div className='container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-32'>
        <div>
          <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
            {t('HERO_EYEBROW')}
          </p>
          <h1 className='mt-5 font-serif text-5xl leading-[1.05] text-balance md:text-6xl lg:text-7xl'>
            {t('HERO_TITLE_1')}
            <br />
            {t('HERO_TITLE_2')}
          </h1>
          <p className='mt-6 max-w-md text-base leading-relaxed text-muted-foreground'>
            {t('HERO_DESC')}
          </p>
          <div className='mt-10 flex flex-wrap gap-4'>
            <Button asChild variant='luxe' size='xl'>
              <Link href='/shop'>
                {t('HERO_SHOP')} <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='ghostLuxe' size='xl'>
              <Link href='/about'>{t('HERO_STORY')}</Link>
            </Button>
          </div>
        </div>
        <div className='relative'>
          <div
            className='absolute -inset-6 rounded-full bg-blush/40 blur-3xl'
            aria-hidden
          />
          <Image
            src='/images/hero-bag.jpg'
            alt='bagcity cream leather handbag with gold hardware on draped silk'
            width={1600}
            height={1200}
            priority
            className='relative w-full object-cover shadow-elegant'
          />
          <div className='absolute -bottom-6 -left-6 hidden bg-background px-6 py-4 shadow-soft md:block'>
            <p className='font-serif text-3xl text-gold'>10y</p>
            <p className='text-[10px] tracking-luxe uppercase text-muted-foreground'>
              {t('HERO_BADGE')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
