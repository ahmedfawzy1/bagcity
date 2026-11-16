import type { Metadata } from 'next';
import { Amiri, Cairo, Inter, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Providers } from '@/app/providers';
import { SiteChrome } from '@/components/layout/site-chrome';
import { isRtlLocale, routing, type Locale } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-dm-serif',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700'],
});

const amiri = Amiri({
  subsets: ['arabic'],
  variable: '--font-amiri',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'BagCity — Elegant Bags for Every Occasion',
  description:
    'Hand-finished luxury handbags, totes, crossbody bags, clutches and backpacks. Crafted in Italy, designed in Paris. Complimentary shipping over $150.',
  authors: [{ name: 'BagCity' }],
  openGraph: {
    title: 'BagCity — Elegant Bags for Every Occasion',
    description:
      'Hand-finished luxury handbags, crafted in Italy and designed in Paris.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = isRtlLocale(locale as Locale) ? 'rtl' : 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${playfair.variable} ${cairo.variable} ${amiri.variable}`}
      data-scroll-behavior='smooth'
    >
      <body className='min-h-screen flex flex-col'>
        <NextIntlClientProvider>
          <Providers>
            <SiteChrome>{children}</SiteChrome>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
