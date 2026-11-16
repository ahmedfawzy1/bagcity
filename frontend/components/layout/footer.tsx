'use client';

import { Link } from '@/i18n/navigation';
import { Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('FOOTER');
  const tHeader = useTranslations('HEADER');
  const tBrand = useTranslations('BRAND');

  return (
    <footer className='mt-24 border-t border-border bg-secondary/40'>
      <div className='container grid gap-12 py-16 md:grid-cols-4'>
        <div>
          <h3 className='font-serif text-2xl'>{tBrand('NAME')}</h3>
          <p className='mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground'>
            {t('TAGLINE')}
          </p>
          <div className='mt-6 flex gap-4 text-foreground/70'>
            <Link
              href='#'
              aria-label={tHeader('INSTAGRAM')}
              className='hover:text-gold transition-smooth'
            >
              <Instagram className='h-4 w-4' />
            </Link>
            <Link
              href='#'
              aria-label={tHeader('FACEBOOK')}
              className='hover:text-gold transition-smooth'
            >
              <Facebook className='h-4 w-4' />
            </Link>
            <Link
              href='#'
              aria-label={tHeader('TWITTER')}
              className='hover:text-gold transition-smooth'
            >
              <Twitter className='h-4 w-4' />
            </Link>
          </div>
        </div>

        <div>
          <h4 className='text-xs tracking-luxe uppercase text-foreground'>
            {t('SHOP')}
          </h4>
          <ul className='mt-5 space-y-3 text-sm text-muted-foreground'>
            <li>
              <Link href='/shop' className='hover:text-gold transition-smooth'>
                {t('ALL_BAGS')}
              </Link>
            </li>
            <li>
              <Link
                href='/shop?category=Tote'
                className='hover:text-gold transition-smooth'
              >
                {t('TOTES')}
              </Link>
            </li>
            <li>
              <Link
                href='/shop?category=Crossbody'
                className='hover:text-gold transition-smooth'
              >
                {t('CROSSBODY')}
              </Link>
            </li>
            <li>
              <Link
                href='/shop?category=Clutch'
                className='hover:text-gold transition-smooth'
              >
                {t('CLUTCHES')}
              </Link>
            </li>
            <li>
              <Link
                href='/shop?category=Backpack'
                className='hover:text-gold transition-smooth'
              >
                {t('BACKPACKS')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='text-xs tracking-luxe uppercase text-foreground'>
            {t('MAISON')}
          </h4>
          <ul className='mt-5 space-y-3 text-sm text-muted-foreground'>
            <li>
              <Link
                href='/our-story'
                className='hover:text-gold transition-smooth'
              >
                {t('OUR_STORY')}
              </Link>
            </li>
            <li>
              <Link href='/blog' className='hover:text-gold transition-smooth'>
                {t('JOURNAL')}
              </Link>
            </li>
            <li>
              <Link
                href='/contact'
                className='hover:text-gold transition-smooth'
              >
                {t('CONTACT')}
              </Link>
            </li>
            <li>
              <Link href='/faq' className='hover:text-gold transition-smooth'>
                {t('FAQ')}
              </Link>
            </li>
            <li>
              <Link
                href='/shipping-returns'
                className='hover:text-gold transition-smooth'
              >
                {t('SHIPPING_RETURNS')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className='text-xs tracking-luxe uppercase text-foreground'>
            {t('FOLLOW_US')}
          </h4>
          <p className='mt-5 text-sm text-muted-foreground'>
            {t('FOLLOW_DESC')}
          </p>
          <div className='mt-6 flex gap-5'>
            <Link
              href='#'
              aria-label={tHeader('INSTAGRAM')}
              className='text-foreground/70 hover:text-gold transition-smooth'
            >
              <Instagram className='h-5 w-5' />
            </Link>
            <Link
              href='#'
              aria-label={tHeader('FACEBOOK')}
              className='text-foreground/70 hover:text-gold transition-smooth'
            >
              <Facebook className='h-5 w-5' />
            </Link>
            <Link
              href='#'
              aria-label={tHeader('TWITTER')}
              className='text-foreground/70 hover:text-gold transition-smooth'
            >
              <Twitter className='h-5 w-5' />
            </Link>
          </div>
        </div>
      </div>

      <div className='border-t border-border'>
        <div className='container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row'>
          <p>{t('COPYRIGHT', { year: new Date().getFullYear() })}</p>
          <p className='tracking-wider'>{t('LEGAL')}</p>
        </div>
      </div>
    </footer>
  );
}
