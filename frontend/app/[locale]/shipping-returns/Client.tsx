"use client";

import { Link } from "@/i18n/navigation";
import { Truck, RotateCcw, ShieldCheck, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Client() {
  const t = useTranslations('SHIPPING');

  const PERKS = [
    { icon: Truck, title: t('PERK_1_TITLE'), desc: t('PERK_1_DESC') },
    { icon: Clock, title: t('PERK_2_TITLE'), desc: t('PERK_2_DESC') },
    { icon: RotateCcw, title: t('PERK_3_TITLE'), desc: t('PERK_3_DESC') },
    { icon: ShieldCheck, title: t('PERK_4_TITLE'), desc: t('PERK_4_DESC') },
  ];

  const SHIPPING_OPTIONS = [
    { name: t('OPT_1_NAME'), time: t('OPT_1_TIME'), cost: t('OPT_1_COST'), note: t('OPT_1_NOTE') },
    { name: t('OPT_2_NAME'), time: t('OPT_2_TIME'), cost: t('OPT_2_COST'), note: t('OPT_2_NOTE') },
    { name: t('OPT_3_NAME'), time: t('OPT_3_TIME'), cost: t('OPT_3_COST'), note: t('OPT_3_NOTE') },
    { name: t('OPT_4_NAME'), time: t('OPT_4_TIME'), cost: t('OPT_4_COST'), note: t('OPT_4_NOTE') },
  ];

  const SHIPPING_FAQ = [
    { q: t('SQ1'), a: t('SA1') },
    { q: t('SQ2'), a: t('SA2') },
    { q: t('SQ3'), a: t('SA3') },
    { q: t('SQ4'), a: t('SA4') },
  ];

  const RETURNS_FAQ = [
    { q: t('RQ1'), a: t('RA1') },
    { q: t('RQ2'), a: t('RA2') },
    { q: t('RQ3'), a: t('RA3') },
    { q: t('RQ4'), a: t('RA4') },
    { q: t('RQ5'), a: t('RA5') },
  ];

  return (
    <>
      <section className="gradient-hero">
        <div className="container py-20 text-center md:py-28">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">
            {t('EYEBROW')}
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl text-balance">
            {t('TITLE')}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            {t('DESC')}
          </p>
        </div>
      </section>

      <section className="container py-20 md:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((item) => (
            <div key={item.title} className="border border-border bg-card p-8 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-border text-gold">
                <item.icon className="h-4 w-4" />
              </div>
              <p className="mt-4 font-serif text-lg">{item.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent/30 py-20 md:py-24">
        <div className="container">
          <div className="text-center">
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('DELIVERY_EYEBROW')}</p>
            <h2 className="mt-3 font-serif text-4xl">{t('DELIVERY_TITLE')}</h2>
          </div>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-border border border-border bg-card">
            {SHIPPING_OPTIONS.map((opt) => (
              <div key={opt.name} className="grid grid-cols-3 items-start px-8 py-6 gap-4">
                <div>
                  <p className="font-medium">{opt.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{opt.note}</p>
                </div>
                <p className="text-sm text-muted-foreground">{opt.time}</p>
                <p className="text-right text-sm font-medium">{opt.cost}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20 md:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('FAQ_EYEBROW')}</p>
            <h2 className="mt-3 font-serif text-4xl">{t('SHIP_FAQ_TITLE')}</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {SHIPPING_FAQ.map((item, i) => (
              <AccordionItem key={i} value={`shipping-${i}`}>
                <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-accent/30 py-20 md:py-24">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center">
            <p className="text-xs tracking-luxe uppercase text-muted-foreground">{t('RETURNS_EYEBROW')}</p>
            <h2 className="mt-3 font-serif text-4xl">{t('RETURNS_TITLE')}</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              {t('RETURNS_DESC')}
            </p>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {RETURNS_FAQ.map((item, i) => (
              <AccordionItem key={i} value={`returns-${i}`}>
                <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="container py-20 text-center">
        <h2 className="font-serif text-4xl">{t('QUESTIONS_TITLE')}</h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          {t('QUESTIONS_DESC')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild variant="luxe" size="lg">
            <Link href="/contact">{t('CONTACT_US')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/faq">{t('BROWSE_FAQ')}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
