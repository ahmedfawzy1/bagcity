"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { type BlogPost, formatPostDate } from "@/lib/blog";

export default function Client({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations('BLOG');
  const [feature, ...rest] = posts;

  return (
    <>
      <section className="gradient-hero">
        <div className="container py-20 text-center md:py-28">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('EYEBROW')}</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl text-balance">{t('TITLE')}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            {t('DESC')}
          </p>
        </div>
      </section>

      {feature && (
        <section className="container py-16 md:py-20">
          <Link href={`/blog/${feature.slug}`} className="group grid gap-10 md:grid-cols-2 md:items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={feature.cover}
                alt={feature.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
            </div>
            <div>
              <p className="text-xs tracking-luxe uppercase text-muted-foreground">{feature.category}</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl text-balance transition-smooth group-hover:text-gold">
                {feature.title}
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">{feature.excerpt}</p>
              <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-luxe text-muted-foreground">
                <span>{formatPostDate(feature.date)}</span>
                <span aria-hidden>·</span>
                <span>{feature.readingTime}</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section className="container pb-24 md:pb-28">
          <div className="mb-10 flex items-end justify-between border-b border-border pb-6">
            <h2 className="font-serif text-3xl">{t('MORE')}</h2>
            <p className="text-xs uppercase tracking-luxe text-muted-foreground">{t('STORIES_COUNT', { count: rest.length })}</p>
          </div>
          <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-5 text-xs tracking-luxe uppercase text-muted-foreground">{post.category}</p>
                  <h3 className="mt-2 font-serif text-2xl text-balance transition-smooth group-hover:text-gold">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs uppercase tracking-luxe text-muted-foreground">
                    <span>{formatPostDate(post.date)}</span>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
