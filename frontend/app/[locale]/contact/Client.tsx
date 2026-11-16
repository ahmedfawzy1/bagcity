'use client';

import { Mail, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

export default function Client() {
  const t = useTranslations('CONTACT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('TOAST_SUCCESS'), { description: t('TOAST_DESC') });
    (e.target as HTMLFormElement).reset();
  };

  const contactCards = [
    {
      icon: Mail,
      title: t('EMAIL_TITLE'),
      lines: ['contact@bagcity.com'],
      desc: t('EMAIL_DESC'),
    },
    {
      icon: Phone,
      title: t('PHONE_TITLE'),
      lines: ['+33 1 42 00 00 00'],
      desc: t('PHONE_DESC'),
    },
    {
      icon: MapPin,
      title: t('ATELIER_TITLE'),
      lines: ['12 Rue des Archives', '75004 Paris, France'],
      desc: t('ATELIER_DESC'),
    },
  ];

  return (
    <>
      <section className='gradient-hero'>
        <div className='container py-20 text-center'>
          <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
            {t('EYEBROW')}
          </p>
          <h1 className='mt-4 font-serif text-5xl md:text-6xl'>{t('TITLE')}</h1>
          <p className='mx-auto mt-5 max-w-xl text-muted-foreground'>
            {t('DESC')}
          </p>
        </div>
      </section>

      <section className='container py-20'>
        <div className='grid gap-6 md:grid-cols-3'>
          {contactCards.map(c => (
            <div
              key={c.title}
              className='border border-border bg-card p-8 text-center'
            >
              <div className='mx-auto grid h-12 w-12 place-items-center rounded-full border border-border text-gold'>
                <c.icon className='h-4 w-4' />
              </div>
              <p className='mt-4 text-xs tracking-luxe uppercase'>{c.title}</p>
              {c.lines.map(l => (
                <p key={l} className='mt-1 text-sm font-medium'>
                  {l}
                </p>
              ))}
              <p className='mt-2 text-xs text-muted-foreground'>{c.desc}</p>
            </div>
          ))}
        </div>

        <div className='mt-6 flex items-center justify-center gap-3 border border-border bg-card px-6 py-5'>
          <Clock className='h-4 w-4 shrink-0 text-gold' />
          <p className='text-sm text-muted-foreground'>
            <span className='font-medium text-foreground'>{t('HOURS')}</span>{' '}
            {t('HOURS_TIME')}
          </p>
        </div>
      </section>

      <section className='bg-accent/30 py-20'>
        <div className='container'>
          <div className='text-center'>
            <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
              {t('FORM_EYEBROW')}
            </p>
            <h2 className='mt-3 font-serif text-4xl'>{t('FORM_TITLE')}</h2>
            <p className='mx-auto mt-3 max-w-md text-sm text-muted-foreground'>
              {t('FORM_DESC')}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className='mx-auto mt-12 max-w-2xl space-y-6'
          >
            <div className='grid gap-6 sm:grid-cols-2'>
              <div>
                <Label htmlFor='name'>{t('NAME')}</Label>
                <Input id='name' required className='mt-2 h-12 rounded-none' />
              </div>
              <div>
                <Label htmlFor='cemail'>{t('EMAIL')}</Label>
                <Input
                  id='cemail'
                  type='email'
                  required
                  className='mt-2 h-12 rounded-none'
                />
              </div>
            </div>
            <div>
              <Label htmlFor='inquiry'>{t('INQUIRY')}</Label>
              <Select>
                <SelectTrigger id='inquiry' className='mt-2 h-12 rounded-none'>
                  <SelectValue placeholder={t('INQUIRY_PLACEHOLDER')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='order'>{t('INQUIRY_ORDER')}</SelectItem>
                  <SelectItem value='returns'>
                    {t('INQUIRY_RETURNS')}
                  </SelectItem>
                  <SelectItem value='product'>
                    {t('INQUIRY_PRODUCT')}
                  </SelectItem>
                  <SelectItem value='bespoke'>
                    {t('INQUIRY_BESPOKE')}
                  </SelectItem>
                  <SelectItem value='other'>{t('INQUIRY_OTHER')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor='message'>{t('MESSAGE')}</Label>
              <Textarea
                id='message'
                rows={6}
                required
                className='mt-2 rounded-none'
              />
            </div>
            <Button type='submit' variant='luxe' size='lg' className='w-full'>
              {t('SEND')}
            </Button>
          </form>
        </div>
      </section>

      <section className='container py-16 text-center'>
        <p className='text-xs tracking-luxe uppercase text-muted-foreground'>
          {t('FAQ_EYEBROW')}
        </p>
        <h2 className='mt-3 font-serif text-3xl'>{t('FAQ_TITLE')}</h2>
        <p className='mx-auto mt-4 max-w-md text-muted-foreground'>
          {t('FAQ_DESC')}
        </p>
        <Button
          asChild
          variant='outline'
          size='lg'
          className='mt-6 gap-2 rounded-none'
        >
          <Link href='/faq'>
            {t('FAQ_CTA')} <ArrowRight className='h-4 w-4' />
          </Link>
        </Button>
      </section>
    </>
  );
}
