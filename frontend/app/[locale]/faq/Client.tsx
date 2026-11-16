"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Client() {
  const t = useTranslations('FAQ');

  const faqs = [
    { q: t('Q1'), a: t('A1') },
    { q: t('Q2'), a: t('A2') },
    { q: t('Q3'), a: t('A3') },
    { q: t('Q4'), a: t('A4') },
    { q: t('Q5'), a: t('A5') },
    { q: t('Q6'), a: t('A6') },
    { q: t('Q7'), a: t('A7') },
    { q: t('Q8'), a: t('A8') },
  ];

  return (
    <>
      <section className="gradient-hero">
        <div className="container py-20 text-center">
          <p className="text-xs tracking-luxe uppercase text-muted-foreground">
            {t('EYEBROW')}
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">{t('TITLE')}</h1>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                <AccordionTrigger className="py-6 text-left font-serif text-lg hover:text-gold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
