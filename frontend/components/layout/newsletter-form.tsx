"use client";

import { useTranslations } from "next-intl";

export function NewsletterForm({ className = "" }: { className?: string }) {
  const t = useTranslations('FOOTER');

  return (
    <form
      className={`flex border-b border-foreground/40 ${className}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder={t('NEWSLETTER_PLACEHOLDER')}
        className="w-full bg-transparent py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        className="text-xs tracking-luxe uppercase text-foreground hover:text-gold transition-smooth"
      >
        {t('NEWSLETTER_JOIN')}
      </button>
    </form>
  );
}
