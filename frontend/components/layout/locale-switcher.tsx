'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const LOCALE_LABELS: Record<Locale, { label: string; native: string }> = {
  en: { label: 'English', native: 'EN' },
  ar: { label: 'العربية', native: 'AR' },
};

type Variant = 'icon' | 'inline';

export function LocaleSwitcher({ variant = 'icon' }: { variant?: Variant }) {
  const t = useTranslations('HEADER');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const switchTo = (next: Locale) => {
    if (next === locale) {
      setOpen(false);
      return;
    }
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  if (variant === 'inline') {
    return (
      <div className='flex items-center gap-2'>
        {routing.locales.map((l) => (
          <button
            key={l}
            type='button'
            onClick={() => switchTo(l)}
            disabled={isPending}
            className={cn(
              'px-2 py-1 text-xs tracking-wide uppercase transition-smooth',
              l === locale
                ? 'text-gold'
                : 'text-foreground/60 hover:text-foreground',
            )}
          >
            {LOCALE_LABELS[l].native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-label={t('CHANGE_LANGUAGE')}
        aria-haspopup='menu'
        aria-expanded={open}
        disabled={isPending}
        className='flex items-center gap-1 text-foreground/80 hover:text-gold transition-smooth disabled:opacity-50'
      >
        <Globe className='h-[18px] w-[18px]' />
        <span className='text-xs tracking-wide uppercase'>
          {LOCALE_LABELS[locale].native}
        </span>
      </button>
      {open && (
        <div
          role='menu'
          className='absolute end-0 top-full mt-2 w-36 border border-border bg-background shadow-elegant z-50'
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              type='button'
              role='menuitemradio'
              aria-checked={l === locale}
              onClick={() => switchTo(l)}
              className={cn(
                'block w-full px-4 py-3 text-start text-sm transition-smooth hover:bg-muted',
                l === locale && 'text-gold',
              )}
            >
              {LOCALE_LABELS[l].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
