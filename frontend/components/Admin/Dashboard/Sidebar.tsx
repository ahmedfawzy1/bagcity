'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Tag,
  Users,
  Truck,
  Gift,
  UserCog,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations('ADMIN_NAV');
  const tBrand = useTranslations('BRAND');
  const pathname = usePathname();
  const { logout } = useAuthStore();

  const sidebarLinks = [
    { label: t('DASHBOARD'), icon: LayoutDashboard, href: '/admin' },
    { label: t('PRODUCTS'), icon: Package, href: '/admin/products' },
    { label: t('CATEGORIES'), icon: Tag, href: '/admin/categories' },
    { label: t('CUSTOMERS'), icon: Users, href: '/admin/customers' },
    { label: t('ORDERS'), icon: Truck, href: '/admin/orders' },
    { label: t('COUPONS'), icon: Gift, href: '/admin/coupons' },
    { label: t('STAFF'), icon: UserCog, href: '/admin/staff' },
  ];

  return (
    <div className='flex h-full flex-col'>
      <div className='flex h-20 items-center px-6 border-b border-border'>
        <Link href='/' onClick={onNavigate} className='block'>
          <div className='text-xl tracking-tight'>{tBrand('NAME')}</div>
          <div className='text-[10px] tracking-luxe uppercase text-muted-foreground mt-0.5'>
            {t('LABEL')}
          </div>
        </Link>
      </div>

      <nav className='flex-1 overflow-y-auto px-3 py-6'>
        <div className='text-[10px] uppercase tracking-luxe text-muted-foreground px-3 pb-3'>
          {t('MANAGE')}
        </div>
        <ul className='space-y-1'>
          {sidebarLinks.map(({ label, icon: Icon, href }) => {
            const isActive =
              href === '/admin'
                ? pathname === '/admin'
                : pathname?.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-accent/40 text-foreground font-medium'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground',
                  )}
                >
                  {isActive && (
                    <span className='absolute ltr:left-0 rtl:right-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gold' />
                  )}
                  <Icon
                    className={cn(
                      'h-4.5 w-4.5',
                      isActive
                        ? 'text-gold'
                        : 'text-foreground/60 group-hover:text-foreground',
                    )}
                  />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className='border-t border-border p-4 space-y-3'>
        <div className='flex items-center justify-between px-1'>
          <span className='text-[10px] uppercase tracking-luxe text-muted-foreground'>
            {t('LANGUAGE')}
          </span>
          <LocaleSwitcher variant='inline' />
        </div>
        <button
          type='button'
          onClick={() => logout()}
          className='flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground cursor-pointer'
        >
          <LogOut className='h-4 w-4' />
          {t('LOGOUT')}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const t = useTranslations('ADMIN_NAV');
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <>
      <aside className='hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-background'>
        <SidebarBody />
      </aside>

      <div className='md:hidden'>
        <button
          type='button'
          onClick={() => setIsOpen(true)}
          aria-label={t('OPEN_MENU')}
          className={cn(
            'fixed top-4 left-4 z-30 inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-soft',
            isOpen && 'hidden',
          )}
        >
          <Menu className='h-5 w-5' />
        </button>

        <div
          className={cn(
            'fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200',
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
          onClick={close}
        />

        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 ease-out',
            isOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <button
            type='button'
            onClick={close}
            aria-label={t('CLOSE_MENU')}
            className='absolute top-5 right-4 text-foreground/70 hover:text-foreground'
          >
            <X className='h-5 w-5' />
          </button>
          <SidebarBody onNavigate={close} />
        </aside>
      </div>
    </>
  );
}
