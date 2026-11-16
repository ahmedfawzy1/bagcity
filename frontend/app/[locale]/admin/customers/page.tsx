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
import {
  useAdminCustomers,
  useUpdateCustomer,
  useDeleteCustomer,
} from '@/hooks/admin/use-admin-customers';

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
        <TableCell>
          <Skeleton className='h-4 w-32' />
        </TableCell>
      </TableRow>
    ))}
  </>
);

interface AdminCustomer {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  createdAt: string;
}

export default function CustomersPage() {
  const t = useTranslations('ADMIN_CUSTOMERS');
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const customersQuery = useAdminCustomers({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const customers: AdminCustomer[] = customersQuery.data?.customers ?? [];
  const totalPages = customersQuery.data?.totalPages ?? 1;
  const loading = customersQuery.isPending;

  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  if (customersQuery.isError) {
    toast.error(t('FETCH_ERROR'));
  }

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCustomers([]);
    setCurrentPage(1);
  };

  const handleDeleteCustomer = (customerId: string) => {
    deleteCustomer.mutate(customerId, {
      onSuccess: () => toast.success(t('DELETED')),
      onError: (error: any) =>
        toast.error(error.response?.data?.message || t('DELETE_ERROR')),
    });
  };

  const handleBulkDelete = () => {
    selectedCustomers.forEach(id => handleDeleteCustomer(id));
    setSelectedCustomers([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map((c: AdminCustomer) => c._id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers(prev => [...prev, customerId]);
    } else {
      setSelectedCustomers(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleEdit = (customer: any) => {
    setEditRowId(customer._id);
    setEditData({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = (customerId: string) => {
    updateCustomer.mutate(
      { id: customerId, data: editData },
      {
        onSuccess: () => {
          toast.success(t('UPDATED'));
          setEditRowId(null);
          setEditData({});
        },
        onError: (error: any) =>
          toast.error(error.response?.data?.message || t('UPDATE_ERROR')),
      }
    );
  };

  const handleEditCancel = () => {
    setEditRowId(null);
    setEditData({});
  };

  return (
    <div className='px-4 pt-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>{t('TITLE')}</h1>
        {selectedCustomers.length > 0 && (
          <Button
            variant='destructive'
            onClick={handleBulkDelete}
            disabled={loading}
            className='h-8'
          >
            {t('DELETE_SELECTED', { count: selectedCustomers.length })}
          </Button>
        )}
      </div>
      <Card className='py-0'>
        <CardContent className='p-2 md:p-4 flex justify-between'>
          <form onSubmit={handleSearch} className='w-full flex gap-2'>
            <Input
              type='text'
              placeholder={t('SEARCH_PLACEHOLDER')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='w-full'
            />
            <Button type='submit' className='w-20 h-10'>
              {t('SEARCH')}
            </Button>
            <Button type='button' onClick={handleReset} className='w-20 h-10'>
              {t('RESET')}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedCustomers.length === customers.length &&
                      customers.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>{t('COL_ID')}</TableHead>
                <TableHead>{t('COL_NAME')}</TableHead>
                <TableHead>{t('COL_EMAIL')}</TableHead>
                <TableHead>{t('COL_DATE')}</TableHead>
                <TableHead>{t('COL_ACTIONS')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center'>
                    {t('NONE_FOUND')}
                  </TableCell>
                </TableRow>
              ) : (
                customers.map(customer => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer._id)}
                        onCheckedChange={checked =>
                          handleSelectCustomer(customer._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>{customer._id}</TableCell>
                    {editRowId === customer._id ? (
                      <>
                        <TableCell>
                          <Input
                            name='first_name'
                            value={editData.first_name}
                            onChange={handleEditChange}
                            className='w-24'
                          />
                          <Input
                            name='last_name'
                            value={editData.last_name}
                            onChange={handleEditChange}
                            className='w-24 mt-1'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            name='email'
                            value={editData.email}
                            onChange={handleEditChange}
                            className='w-48'
                          />
                        </TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            size='sm'
                            onClick={() => handleEditSave(customer._id)}
                            className='me-2'
                          >
                            {t('SAVE')}
                          </Button>
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={handleEditCancel}
                          >
                            {t('CANCEL')}
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <span>{`${customer.first_name} ${customer.last_name}`}</span>
                          </div>
                        </TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{formatDate(customer.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-blue-600'
                            onClick={() => handleEdit(customer)}
                            disabled={loading}
                          >
                            {t('EDIT')}
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='text-red-600'
                            onClick={() => handleDeleteCustomer(customer._id)}
                            disabled={loading}
                          >
                            {t('DELETE')}
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className='flex items-center mt-4'>
        <div className='flex-1 flex justify-center'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              {t('PREV')}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              page => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page)}
                  className='w-8 h-8 p-0'
                  disabled={loading}
                >
                  {page}
                </Button>
              ),
            )}
            <Button
              variant='outline'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              {t('NEXT')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
