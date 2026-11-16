import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});

export type Locale = (typeof routing.locales)[number];

export const rtlLocales: ReadonlySet<Locale> = new Set(['ar']);

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.has(locale);
}
