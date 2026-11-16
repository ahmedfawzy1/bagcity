"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { type BlogPost, formatPostDate } from "@/lib/blog";

export default function Client({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  const t = useTranslations('BLOG');

  return (
    <>
      <article>
        <header className="container pt-12 pb-10 md:pt-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground transition-smooth hover:text-gold"
          >
            <ArrowLeft className="h-3 w-3" />
            {t('BACK')}
          </Link>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">{post.category}</p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl text-balance">{post.title}</h1>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-luxe text-muted-foreground">
              <span>{post.author}</span>
              <span aria-hidden>·</span>
              <span>{formatPostDate(post.date)}</span>
              <span aria-hidden>·</span>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="container">
          <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="container py-16 md:py-20">
          <div className="mx-auto max-w-2xl space-y-6 font-serif text-lg leading-relaxed text-foreground/90">
            {post.body.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "first-letter:font-serif first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none first-letter:text-gold" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-accent/30 py-20 md:py-24">
          <div className="container">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-3xl">{t('CONTINUE_READING')}</h2>
              <Link
                href="/blog"
                className="text-xs uppercase tracking-luxe text-muted-foreground transition-smooth hover:text-gold"
              >
                {t('ALL_STORIES')}
              </Link>
            </div>
            <ul className="grid gap-x-10 gap-y-12 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/blog/${r.slug}`} className="group block">
                    <div className="relative aspect-[4/5] w-full overflow-hidden">
                      <Image
                        src={r.cover}
                        alt={r.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-4 text-xs tracking-luxe uppercase text-muted-foreground">{r.category}</p>
                    <h3 className="mt-2 font-serif text-xl text-balance transition-smooth group-hover:text-gold">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-xs uppercase tracking-luxe text-muted-foreground">
                      {formatPostDate(r.date)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="container py-20 text-center">
        <h2 className="font-serif text-4xl md:text-5xl">{t('CTA_TITLE')}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {t('CTA_DESC')}
        </p>
        <Button asChild variant="luxe" size="lg" className="mt-8">
          <Link href="/shop">{t('CTA_BUTTON')}</Link>
        </Button>
      </section>
    </>
  );
}
