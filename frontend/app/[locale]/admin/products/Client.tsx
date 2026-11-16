'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-hot-toast';
import {
  useAdminProducts,
  useDeleteProduct,
} from '@/hooks/admin/use-admin-products';
import { useFilters } from '@/hooks/admin/use-admin-filters';

export default function Client() {
  const t = useTranslations('ADMIN');
  const productsQuery = useAdminProducts({ page: 1, limit: 50 });
  const filtersQuery = useFilters();
  const deleteProductMutation = useDeleteProduct();

  const categories = filtersQuery.data?.categories ?? [];
  const loading = productsQuery.isPending;

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceSort, setPriceSort] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    const products = productsQuery.data?.products;
    if (!products) return [];
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(
        product => product.category?.name === categoryFilter,
      );
    }

    if (priceSort) {
      result.sort((a, b) => {
        const priceA = a.priceRange.minVariantPrice;
        const priceB = b.priceRange.minVariantPrice;
        return priceSort === 'asc' ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [productsQuery.data?.products, searchQuery, categoryFilter, priceSort]);

  const handleReset = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setPriceSort('');
    setSelectedProducts([]);
  };

  const handleBulkDeleteProducts = async () => {
    try {
      await Promise.all(
        selectedProducts.map(id => deleteProductMutation.mutateAsync(id)),
      );
      toast.success(t('BULK_DELETE_SUCCESS'));
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error deleting selected products:', error);
      toast.error(t('BULK_DELETE_ERROR'));
    }
  };

  const handleSelectAllProducts = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProductMutation.mutate(productId, {
      onSuccess: () => toast.success(t('DELETE_SUCCESS')),
      onError: () => toast.error(t('DELETE_ERROR')),
    });
  };

  const allSelected =
    selectedProducts.length === filteredProducts.length &&
    filteredProducts.length > 0;

  return (
    <div className='space-y-6'>
      <header className='flex flex-wrap items-end justify-between gap-4'>
        <div className='space-y-1'>
          <p className='text-[11px] uppercase tracking-luxe text-muted-foreground'>
            {t('CATALOG')}
          </p>
          <h1 className='font-serif text-3xl text-foreground'>{t('PRODUCTS')}</h1>
          <p className='text-sm text-muted-foreground'>
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? t('ITEM') : t('ITEMS')}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {selectedProducts.length > 0 && (
            <Button variant='destructive' onClick={handleBulkDeleteProducts}>
              {t('DELETE_SELECTED', { count: selectedProducts.length })}
            </Button>
          )}
          <Link
            href='/admin/products/create'
            className='inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90'
          >
            {t('ADD_PRODUCT')}
          </Link>
        </div>
      </header>

      <div className='rounded-lg border border-border bg-background p-3 md:p-4'>
        <div className='flex flex-col md:flex-row gap-3 md:items-center'>
          <Input
            placeholder={t('SEARCH_PLACEHOLDER')}
            className='md:flex-1'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className='md:w-44'>
              <SelectValue placeholder={t('CATEGORY')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>{t('ALL_CATEGORIES')}</SelectItem>
              {categories.map(category => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priceSort} onValueChange={setPriceSort}>
            <SelectTrigger className='md:w-44'>
              <SelectValue placeholder={t('SORT_BY_PRICE')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='asc'>{t('LOW_TO_HIGH')}</SelectItem>
              <SelectItem value='desc'>{t('HIGH_TO_LOW')}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant='outline' onClick={handleReset} className='md:w-auto'>
            {t('RESET')}
          </Button>
        </div>
      </div>

      <div className='overflow-hidden rounded-lg border border-border bg-background'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/40 hover:bg-muted/40'>
                <TableHead className='w-10'>
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAllProducts}
                  />
                </TableHead>
                <TableHead className='text-xs uppercase tracking-luxe text-muted-foreground'>
                  {t('PRODUCT_COL')}
                </TableHead>
                <TableHead className='text-xs uppercase tracking-luxe text-muted-foreground'>
                  {t('CATEGORY_COL')}
                </TableHead>
                <TableHead className='text-xs uppercase tracking-luxe text-muted-foreground'>
                  {t('PRICE_COL')}
                </TableHead>
                <TableHead className='text-xs uppercase tracking-luxe text-muted-foreground'>
                  {t('STOCK_COL')}
                </TableHead>
                <TableHead className='text-xs uppercase tracking-luxe text-muted-foreground'>
                  {t('STATUS_COL')}
                </TableHead>
                <TableHead className='text-xs uppercase tracking-luxe text-muted-foreground text-end'>
                  {t('ACTIONS_COL')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className='h-4 w-full' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='py-12 text-center text-sm text-muted-foreground'
                  >
                    {t('NO_RESULTS')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map(product => {
                  const stock = product.variants.reduce(
                    (total, v) => total + v.stock,
                    0,
                  );
                  const min = product.priceRange.minVariantPrice;
                  const max = product.priceRange.maxVariantPrice;
                  return (
                    <TableRow key={product._id} className='hover:bg-muted/30'>
                      <TableCell>
                        <Checkbox
                          checked={selectedProducts.includes(product._id)}
                          onCheckedChange={checked =>
                            handleSelectProduct(product._id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          {product.images[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              className='h-10 w-10 rounded-md object-cover border border-border'
                              width={40}
                              height={40}
                            />
                          )}
                          <div>
                            <div className='font-medium text-foreground'>
                              {product.name}
                            </div>
                            <Link
                              href={`/product/${product.slug}`}
                              className='text-xs text-muted-foreground hover:text-gold transition-colors'
                            >
                              {t('VIEW_ON_STORE')}
                            </Link>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-foreground/80'>
                        {product?.category?.name ?? '—'}
                      </TableCell>
                      <TableCell className='tabular-nums text-foreground/90'>
                        {min === max ? `$${min}` : `$${min} – $${max}`}
                      </TableCell>
                      <TableCell className='tabular-nums text-foreground/80'>
                        {stock}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            product.availableForSale
                              ? 'bg-accent/40 text-foreground'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              product.availableForSale
                                ? 'bg-gold'
                                : 'bg-destructive'
                            }`}
                          />
                          {product.availableForSale
                            ? t('IN_STOCK')
                            : t('OUT_OF_STOCK')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center justify-end gap-1'>
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className='inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted'
                          >
                            {t('EDIT')}
                          </Link>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive'
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            {t('DELETE')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
