'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { CircleUser, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Logo } from './logo';
import { LocaleSwitcher } from './locale-switcher';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Suggestion = {
  slug: string;
  name: string;
  image: string;
  price: number;
};

function isActive(pathname: string, href: string) {
  const [path] = href.split('?');
  return pathname === path;
}

export function Header() {
  const t = useTranslations('HEADER');
  const tNav = useTranslations('NAV');

  const nav = [
    { href: '/shop', label: tNav('SHOP') },
    { href: '/about', label: tNav('ABOUT') },
    { href: '/blog', label: tNav('JOURNAL') },
    { href: '/contact', label: tNav('CONTACT') },
  ];

  const items = useCartStore(s => s.items);
  const wishlistProducts = useWishlistStore(s => s.products);
  const wishlistHydrated = useWishlistStore(s => s.hasHydrated);
  const logout = useAuthStore(s => s.logout);
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && !!session?.user;
  const isAdmin = isAuthenticated && session?.user?.role === 'admin';
  const count = items.reduce((sum, it) => sum + it.quantity, 0);
  const wishlistCount = wishlistHydrated ? wishlistProducts.length : 0;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const [allProducts, setAllProducts] = useState<(Suggestion & { category: string })[] | null>(null);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  const suggestions = useMemo<Suggestion[]>(() => {
    if (!q.trim() || !allProducts) return [];
    const lower = q.toLowerCase();
    return allProducts
      .filter(p => p.name.toLowerCase().includes(lower) || p.category.includes(lower))
      .slice(0, 6);
  }, [q, allProducts]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQ('');
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!searchOpen || allProducts !== null) return;
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';
    fetch(`${baseURL}/api/products?page=1&limit=100`)
      .then(r => r.json())
      .then(data => {
        const prods = (data.data ?? []).map((p: any) => ({
          slug: p.slug,
          name: p.name,
          image: p.images?.[0] ?? '',
          price: p.priceRange?.minVariantPrice ?? 0,
          category: (p.category?.name ?? p.category ?? '').toLowerCase(),
        }));
        setAllProducts(prods);
      })
      .catch(() => setAllProducts([]));
  }, [searchOpen, allProducts]);

  useEffect(() => {
    if (!searchOpen) return;
    function handle(e: MouseEvent) {
      const target = e.target as Node;
      if (
        searchContainerRef.current && !searchContainerRef.current.contains(target) &&
        searchButtonRef.current && !searchButtonRef.current.contains(target)
      ) {
        closeSearch();
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const doSearch = () => {
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    closeSearch();
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch();
  };

  return (
    <>
    <header className='sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md'>
      <div className='container flex items-center justify-between py-5'>
        <button
          className='md:hidden text-foreground'
          onClick={() => setMobileOpen(true)}
          aria-label={t('OPEN_MENU')}
        >
          <Menu className='h-5 w-5' />
        </button>

        <Logo />

        <nav className='hidden md:flex items-center gap-8 text-sm'>
          {nav.map(n => (
            <Link
              key={n.label}
              href={n.href}
              className={cn(
                'tracking-wide transition-smooth hover:text-gold',
                isActive(pathname, n.href) ? 'text-gold' : 'text-foreground/80',
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className='flex items-center gap-4'>
          <button
            ref={searchButtonRef}
            onClick={() => setSearchOpen(o => !o)}
            aria-label={t('SEARCH')}
            className='text-foreground/80 hover:text-gold transition-smooth'
          >
            <Search className='h-[18px] w-[18px]' />
          </button>
          <Link
            href='/wishlist'
            aria-label={t('WISHLIST')}
            className='relative text-foreground/80 hover:text-gold transition-smooth'
          >
            <Heart className='h-[18px] w-[18px]' />
            {wishlistCount > 0 && (
              <span className='absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] text-gold-foreground'>
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href='/cart'
            aria-label={t('CART')}
            className='relative text-foreground/80 hover:text-gold transition-smooth'
          >
            <ShoppingBag className='h-[18px] w-[18px]' />
            {count > 0 && (
              <span className='absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] text-gold-foreground'>
                {count}
              </span>
            )}
          </Link>

          <LocaleSwitcher />

          <div ref={userMenuRef} className='relative'>
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              aria-label={t('ACCOUNT')}
              className='flex items-center text-foreground/80 hover:text-gold transition-smooth'
            >
              <CircleUser className='h-[18px] w-[18px]' />
            </button>
            {userMenuOpen && (
              <div className='absolute end-0 top-full mt-2 w-44 border border-border bg-background shadow-elegant z-50'>
                {isAuthenticated && (
                  <>
                    {isAdmin && (
                      <Link
                        href='/admin'
                        onClick={() => setUserMenuOpen(false)}
                        className='block px-4 py-3 text-sm hover:bg-muted transition-smooth'
                      >
                        {t('ADMIN')}
                      </Link>
                    )}
                    <Link
                      href='/orders'
                      onClick={() => setUserMenuOpen(false)}
                      className='block px-4 py-3 text-sm hover:bg-muted transition-smooth'
                    >
                      {t('ORDERS')}
                    </Link>
                    <Link
                      href='/profile'
                      onClick={() => setUserMenuOpen(false)}
                      className='block px-4 py-3 text-sm hover:bg-muted transition-smooth'
                    >
                      {t('PROFILE')}
                    </Link>
                    <div className='my-1 h-px bg-border' />
                  </>
                )}
                {isAuthenticated ? (
                  <button
                    type='button'
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    className='block w-full text-start px-4 py-3 text-sm text-destructive hover:bg-muted transition-smooth'
                  >
                    {t('LOGOUT')}
                  </button>
                ) : (
                  <>
                    <Link
                      href='/login'
                      onClick={() => setUserMenuOpen(false)}
                      className='block px-4 py-3 text-sm hover:bg-muted transition-smooth'
                    >
                      {t('LOGIN')}
                    </Link>
                    <Link
                      href='/signup'
                      onClick={() => setUserMenuOpen(false)}
                      className='block px-4 py-3 text-sm hover:bg-muted transition-smooth'
                    >
                      {t('REGISTER')}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={searchContainerRef} className='relative'>
        <div
          className={cn(
            'grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
            searchOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
          aria-hidden={!searchOpen}
        >
          <div className='min-h-0 border-t border-border/40'>
            <form onSubmit={submitSearch} className='container flex items-center gap-3 py-4'>
              <Search className='h-4 w-4 flex-shrink-0 text-muted-foreground' />
              <Input
                ref={searchInputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && closeSearch()}
                placeholder={t('SEARCH_PLACEHOLDER')}
                tabIndex={searchOpen ? 0 : -1}
                className='h-9 flex-1 rounded-none border-0 bg-transparent px-0 text-sm focus-visible:ring-0'
              />
              {q && (
                <button type='button' onClick={() => setQ('')} className='text-muted-foreground hover:text-foreground transition-smooth'>
                  <X className='h-4 w-4' />
                </button>
              )}
            </form>
          </div>
        </div>

        {searchOpen && suggestions.length > 0 && (
          <div className='absolute left-0 right-0 top-full z-50 border-t border-border bg-background shadow-lg'>
            <ul>
              {suggestions.map(s => (
                <li key={s.slug}>
                  <Link
                    href={`/product/${s.slug}`}
                    onClick={closeSearch}
                    className='flex items-center gap-4 px-6 py-3 hover:bg-muted transition-smooth'
                  >
                    <div className='h-12 w-12 flex-shrink-0 overflow-hidden bg-muted'>
                      {s.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt={s.name} className='h-full w-full object-cover' />
                      )}
                    </div>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>{s.name}</p>
                      <p className='text-xs text-muted-foreground'>${s.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type='button'
              onClick={doSearch}
              className='flex w-full items-center justify-between border-t border-border px-6 py-3 text-xs text-muted-foreground hover:bg-muted transition-smooth'
            >
              <span>{t('SEE_ALL_RESULTS')} <span className='italic text-foreground'>"{q}"</span></span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

    </header>

      {/* Mobile drawer — outside <header> to escape its stacking context */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className='absolute inset-0 bg-black/50 backdrop-blur-sm'
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 flex w-72 flex-col bg-background shadow-2xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          {/* Drawer header */}
          <div className='flex items-center justify-between border-b border-border px-6 py-5'>
            <Logo />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label={t('CLOSE_MENU')}
              className='text-foreground/60 hover:text-foreground transition-smooth'
            >
              <X className='h-5 w-5' />
            </button>
          </div>

          {/* Nav links */}
          <nav className='flex flex-1 flex-col px-6 py-6'>
            {[...nav, { href: '/faq', label: tNav('FAQ') }].map(n => (
              <Link
                key={n.label}
                href={n.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'border-b border-border/50 py-4 font-serif text-xl tracking-wide transition-smooth hover:text-gold',
                  isActive(pathname, n.href) ? 'text-gold' : 'text-foreground',
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Language switcher */}
          <div className='border-t border-border px-6 py-4 flex items-center justify-between'>
            <span className='text-xs uppercase tracking-luxe text-muted-foreground'>{t('LANGUAGE')}</span>
            <LocaleSwitcher variant='inline' />
          </div>

          {/* Account links */}
          <div className='border-t border-border px-6 py-6 flex flex-col gap-1'>
            {isAuthenticated ? (
              <>
                <Link href='/orders' onClick={() => setMobileOpen(false)} className='py-2 text-sm text-foreground/70 hover:text-foreground transition-smooth'>{t('ORDERS')}</Link>
                <Link href='/profile' onClick={() => setMobileOpen(false)} className='py-2 text-sm text-foreground/70 hover:text-foreground transition-smooth'>{t('PROFILE')}</Link>
                {isAdmin && (
                  <Link href='/admin' onClick={() => setMobileOpen(false)} className='py-2 text-sm text-foreground/70 hover:text-foreground transition-smooth'>{t('ADMIN')}</Link>
                )}
                <button
                  type='button'
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className='py-2 text-left text-sm text-destructive hover:opacity-80 transition-smooth'
                >
                  {t('LOGOUT')}
                </button>
              </>
            ) : (
              <>
                <Link href='/login' onClick={() => setMobileOpen(false)} className='py-2 text-sm text-foreground/70 hover:text-foreground transition-smooth'>{t('LOGIN')}</Link>
                <Link href='/signup' onClick={() => setMobileOpen(false)} className='py-2 text-sm text-foreground/70 hover:text-foreground transition-smooth'>{t('REGISTER')}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
