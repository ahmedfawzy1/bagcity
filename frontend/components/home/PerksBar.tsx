'use client';

import { Truck, Lock, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function PerksBar() {
  const t = useTranslations('HOME');

  const perks = [
    { icon: Truck, title: t('PERKS_SHIPPING_TITLE'), sub: t('PERKS_SHIPPING_SUB') },
    { icon: Lock, title: t('PERKS_PAYMENT_TITLE'), sub: t('PERKS_PAYMENT_SUB') },
    { icon: RefreshCw, title: t('PERKS_RETURNS_TITLE'), sub: t('PERKS_RETURNS_SUB') },
  ];

  return (
    <section className="border-y border-border bg-background">
      <div className="container grid gap-6 py-8 sm:grid-cols-3">
        {perks.map((p) => (
          <div key={p.title} className="flex items-center gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-border text-gold">
              <p.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
