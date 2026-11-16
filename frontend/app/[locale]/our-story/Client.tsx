"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function Client() {
  const t = useTranslations("OUR_STORY");

  const values = [
    { t: t("VALUE_1_T"), d: t("VALUE_1_D") },
    { t: t("VALUE_2_T"), d: t("VALUE_2_D") },
    { t: t("VALUE_3_T"), d: t("VALUE_3_D") },
  ];

  const stats = [
    { number: "12", label: t("STAT_1_LABEL") },
    { number: "<3k", label: t("STAT_2_LABEL") },
    { number: "1", label: t("STAT_3_LABEL") },
    { number: "∞", label: t("STAT_4_LABEL") },
  ];

  return (
    <>
      <section className="gradient-hero">
        <div className="container py-20 text-center md:py-28">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t("EYEBROW")}</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl text-balance">
            {t("TITLE")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-muted-foreground">
            {t("DESC")}
          </p>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/hero-bag.jpg"
              alt={t("ATELIER_ALT")}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t("BEGIN_EYEBROW")}</p>
            <h2 className="mt-3 font-serif text-4xl">{t("BEGIN_TITLE")}</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {t("BEGIN_P1")}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t("BEGIN_P2")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-accent/30 py-20 md:py-28">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div className="md:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/bag-shoulder.jpg"
                alt={t("BAG_ALT")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:order-1">
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t("CRAFT_EYEBROW")}</p>
            <h2 className="mt-3 font-serif text-4xl">{t("CRAFT_TITLE")}</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {t("CRAFT_P1")}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t("CRAFT_P2")}
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-28">
        <div className="text-center">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t("VALUES_EYEBROW")}</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t("VALUES_TITLE")}</h2>
        </div>
        <ul className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
          {values.map((v) => (
            <li key={v.t} className="border-l border-gold pl-6">
              <p className="font-serif text-xl">{v.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-accent/30 py-20 md:py-28">
        <div className="container grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t("TODAY_EYEBROW")}</p>
            <h2 className="mt-3 font-serif text-4xl">{t("TODAY_TITLE")}</h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {t("TODAY_P1")}
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {t("TODAY_P2")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="border border-border bg-card p-8 text-center">
                <p className="font-serif text-4xl text-gold">{s.number}</p>
                <p className="mt-2 text-xs tracking-luxe uppercase text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 text-center">
        <h2 className="font-serif text-4xl md:text-5xl">{t("CTA_TITLE")}</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          {t("CTA_DESC")}
        </p>
        <Button asChild variant="luxe" size="lg" className="mt-8">
          <Link href="/shop">{t("CTA_BUTTON")}</Link>
        </Button>
      </section>
    </>
  );
}
