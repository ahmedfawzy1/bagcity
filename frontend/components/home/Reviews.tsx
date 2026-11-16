'use client';

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Review } from "@/app/types/review";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const t = useTranslations('HOME');

  if (!reviews.length) return null;

  return (
    <section className="bg-accent/40 py-20 md:py-28">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('REVIEWS_EYEBROW')}</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('REVIEWS_TITLE')}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r._id} className="bg-background p-8 shadow-soft">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 font-serif text-lg italic leading-relaxed text-foreground">
                &ldquo;{r.comment}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-xs tracking-luxe uppercase text-muted-foreground">
                — {r.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
