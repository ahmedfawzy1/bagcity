'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  type Coupon,
} from '@/hooks/admin/use-admin-coupons';

const TableSkeleton = () => (
  <>
    {Array.from({ length: 8 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className='h-4 w-4' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-24' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-32' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-40' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-48' />
        </TableCell>
        <TableCell>
          <Skeleton className='h-4 w-20' />
        </TableCell>
      </TableRow>
    ))}
  </>
);

type CouponFormState = {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number | null;
};

const generateCouponCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length)),
  ).join('');
};

export default function CouponsPage() {
  const t = useTranslations('ADMIN_COUPONS');
  const locale = useLocale();
  const couponsQuery = useCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  const coupons = couponsQuery.data ?? [];
  const loading = couponsQuery.isPending;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CouponFormState | null>(null);
  const today = new Date().toISOString().split('T')[0];
  const [newCoupon, setNewCoupon] = useState<CouponFormState>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minPurchase: 0,
    startDate: today,
    endDate: '',
    isActive: true,
    usageLimit: null,
  });

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    createCoupon.mutate(newCoupon, {
      onSuccess: () => {
        toast.success(t('ADDED'));
        setIsAddDialogOpen(false);
        setNewCoupon({
          code: '',
          description: '',
          discountType: 'percentage',
          discountValue: 0,
          minPurchase: 0,
          startDate: today,
          endDate: '',
          isActive: true,
          usageLimit: null,
        });
      },
      onError: (error: any) =>
        toast.error(error.response?.data?.message || t('ADD_ERROR')),
    });
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCouponId(coupon._id);
    setEditForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase,
      startDate: coupon.startDate.slice(0, 10),
      endDate: coupon.endDate.slice(0, 10),
      isActive: coupon.isActive,
      usageLimit: coupon.usageLimit,
    });
  };

  const closeEditDialog = () => {
    setEditingCouponId(null);
    setEditForm(null);
  };

  const handleUpdateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCouponId || !editForm) return;
    updateCoupon.mutate(
      { id: editingCouponId, data: editForm },
      {
        onSuccess: () => {
          toast.success(t('UPDATED'));
          closeEditDialog();
        },
        onError: (error: any) =>
          toast.error(error.response?.data?.message || t('UPDATE_ERROR')),
      },
    );
  };

  const handleDeleteCoupon = (couponId: string) => {
    deleteCoupon.mutate(couponId, {
      onSuccess: () => toast.success(t('DELETED')),
      onError: (error: any) =>
        toast.error(error.response?.data?.message || t('DELETE_ERROR')),
    });
  };

  const handleBulkDelete = () => {
    selectedCoupons.forEach(id => handleDeleteCoupon(id));
    setSelectedCoupons([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCoupons(filteredCoupons.map(c => c._id));
    } else {
      setSelectedCoupons([]);
    }
  };

  const handleSelectCoupon = (couponId: string, checked: boolean) => {
    if (checked) {
      setSelectedCoupons(prev => [...prev, couponId]);
    } else {
      setSelectedCoupons(prev => prev.filter(id => id !== couponId));
    }
  };

  const filteredCoupons = (() => {
    if (!coupons) return [];
    if (!searchQuery) return coupons;
    const query = searchQuery.toLowerCase();
    return coupons.filter(
      coupon =>
        coupon.code.toLowerCase().includes(query) ||
        coupon.description.toLowerCase().includes(query),
    );
  })();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='px-4 pt-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>{t('TITLE')}</h1>
        <div className='flex gap-2'>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>{t('ADD')}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('ADD_TITLE')}</DialogTitle>
                <DialogDescription>{t('ADD_DESC')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCoupon} className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    placeholder={t('CODE')}
                    value={newCoupon.code}
                    onChange={e =>
                      setNewCoupon({
                        ...newCoupon,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      setNewCoupon({
                        ...newCoupon,
                        code: generateCouponCode(),
                      })
                    }
                  >
                    <RefreshCw />
                    {t('GENERATE')}
                  </Button>
                </div>
                <Input
                  placeholder={t('DESCRIPTION')}
                  value={newCoupon.description}
                  onChange={e =>
                    setNewCoupon({ ...newCoupon, description: e.target.value })
                  }
                  required
                />
                <Select
                  value={newCoupon.discountType}
                  onValueChange={value =>
                    setNewCoupon({
                      ...newCoupon,
                      discountType: value as 'percentage' | 'fixed',
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('DISCOUNT_TYPE')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='percentage'>{t('PERCENTAGE')}</SelectItem>
                    <SelectItem value='fixed'>{t('FIXED')}</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type='number'
                  placeholder={t('DISCOUNT_VALUE')}
                  value={
                    newCoupon.discountValue === 0 ? '' : newCoupon.discountValue
                  }
                  onChange={e =>
                    setNewCoupon({
                      ...newCoupon,
                      discountValue: Number(e.target.value),
                    })
                  }
                  required
                />
                <Input
                  type='number'
                  placeholder={t('MIN_PURCHASE')}
                  value={
                    newCoupon.minPurchase === 0 ? '' : newCoupon.minPurchase
                  }
                  onChange={e =>
                    setNewCoupon({
                      ...newCoupon,
                      minPurchase: Number(e.target.value),
                    })
                  }
                  required
                />
                <Input
                  type='date'
                  placeholder={t('START_DATE')}
                  value={newCoupon.startDate}
                  onChange={e =>
                    setNewCoupon({ ...newCoupon, startDate: e.target.value })
                  }
                  required
                />
                <Input
                  type='date'
                  placeholder={t('END_DATE')}
                  value={newCoupon.endDate}
                  onChange={e =>
                    setNewCoupon({ ...newCoupon, endDate: e.target.value })
                  }
                  required
                />
                <Input
                  type='number'
                  placeholder={t('USAGE_LIMIT')}
                  value={newCoupon.usageLimit || ''}
                  onChange={e =>
                    setNewCoupon({
                      ...newCoupon,
                      usageLimit: e.target.value
                        ? Number(e.target.value)
                        : null,
                    })
                  }
                />
                <Button type='submit' className='w-full'>
                  {t('ADD')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          {selectedCoupons.length > 0 && (
            <Button
              variant='destructive'
              onClick={handleBulkDelete}
              disabled={loading}
            >
              {t('DELETE_SELECTED', { count: selectedCoupons.length })}
            </Button>
          )}
        </div>
      </div>
      <Card className='py-0'>
        <CardContent className='p-2 md:p-4'>
          <Input
            type='text'
            placeholder={t('SEARCH_PLACEHOLDER')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full'
          />
        </CardContent>
      </Card>
      <Dialog
        open={editingCouponId !== null}
        onOpenChange={open => {
          if (!open) closeEditDialog();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('EDIT_TITLE')}</DialogTitle>
          </DialogHeader>
          {editForm && (
            <form onSubmit={handleUpdateCoupon} className='space-y-4'>
              <div className='flex gap-2'>
                <Input
                  placeholder={t('CODE')}
                  value={editForm.code}
                  onChange={e =>
                    setEditForm({
                      ...editForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setEditForm({
                      ...editForm,
                      code: generateCouponCode(),
                    })
                  }
                >
                  <RefreshCw />
                  {t('GENERATE')}
                </Button>
              </div>
              <Input
                placeholder={t('DESCRIPTION')}
                value={editForm.description}
                onChange={e =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                required
              />
              <Select
                value={editForm.discountType}
                onValueChange={value =>
                  setEditForm({
                    ...editForm,
                    discountType: value as 'percentage' | 'fixed',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('DISCOUNT_TYPE')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='percentage'>{t('PERCENTAGE')}</SelectItem>
                  <SelectItem value='fixed'>{t('FIXED')}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type='number'
                placeholder={t('DISCOUNT_VALUE')}
                value={
                  editForm.discountValue === 0 ? '' : editForm.discountValue
                }
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    discountValue: Number(e.target.value),
                  })
                }
                required
              />
              <Input
                type='number'
                placeholder={t('MIN_PURCHASE')}
                value={editForm.minPurchase === 0 ? '' : editForm.minPurchase}
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    minPurchase: Number(e.target.value),
                  })
                }
                required
              />
              <Input
                type='date'
                value={editForm.startDate}
                onChange={e =>
                  setEditForm({ ...editForm, startDate: e.target.value })
                }
                required
              />
              <Input
                type='date'
                value={editForm.endDate}
                onChange={e =>
                  setEditForm({ ...editForm, endDate: e.target.value })
                }
                required
              />
              <Input
                type='number'
                placeholder={t('USAGE_LIMIT')}
                value={editForm.usageLimit ?? ''}
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    usageLimit: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
              <label className='flex items-center gap-2 text-sm'>
                <Checkbox
                  checked={editForm.isActive}
                  onCheckedChange={checked =>
                    setEditForm({ ...editForm, isActive: checked === true })
                  }
                />
                {t('ACTIVE')}
              </label>
              <Button type='submit' className='w-full'>
                {t('SAVE_CHANGES')}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedCoupons.length === filteredCoupons.length &&
                      filteredCoupons.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{t('COL_CODE')}</TableHead>
                <TableHead>{t('COL_DESC')}</TableHead>
                <TableHead>{t('COL_DISCOUNT')}</TableHead>
                <TableHead>{t('COL_VALIDITY')}</TableHead>
                <TableHead>{t('COL_USAGE')}</TableHead>
                <TableHead>{t('COL_ACTIONS')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center'>
                    {t('NONE_FOUND')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map(coupon => (
                  <TableRow key={coupon._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCoupons.includes(coupon._id)}
                        onCheckedChange={checked =>
                          handleSelectCoupon(coupon._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.description}</TableCell>
                    <TableCell>
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </TableCell>
                    <TableCell>
                      {formatDate(coupon.startDate)} -{' '}
                      {formatDate(coupon.endDate)}
                    </TableCell>
                    <TableCell>
                      {coupon.usedCount}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => openEditDialog(coupon)}
                          disabled={loading}
                        >
                          {t('EDIT')}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-600'
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          disabled={loading}
                        >
                          {t('DELETE')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
