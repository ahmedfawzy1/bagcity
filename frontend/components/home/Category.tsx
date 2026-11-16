'use client';

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function CategoriesSection() {
  const t = useTranslations('HOME');

  const categories = [
    { name: t('TOTES'), slug: "Tote", img: "/images/bag-tote.jpg" },
    { name: t('CROSSBODY'), slug: "Crossbody", img: "/images/bag-crossbody.jpg" },
    { name: t('CLUTCHES'), slug: "Clutch", img: "/images/bag-clutch.jpg" },
    { name: t('BACKPACKS'), slug: "Backpack", img: "/images/bag-backpack.jpg" },
  ];

  return (
    <section className="container py-20 md:py-28">
      <div className="mb-12 text-center">
        <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('CATS_EYEBROW')}</p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('CATS_TITLE')}</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
          >
            <Image
              src={c.img}
              alt={c.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-smooth group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center">
              <h3 className="font-serif text-2xl text-background">{c.name}</h3>
              <span className="mt-2 inline-block text-[10px] tracking-luxe uppercase text-background/90">
                {t('CAT_DISCOVER')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
