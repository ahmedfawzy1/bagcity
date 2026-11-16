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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useStaff,
  useCreateAdmin,
  usePromoteToAdmin,
  useRemoveAdmin,
} from '@/hooks/admin/use-admin-staff';

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

export default function StaffPage() {
  const t = useTranslations('ADMIN_STAFF');
  const locale = useLocale();
  const staffQuery = useStaff();
  const createAdmin = useCreateAdmin();
  const promoteUser = usePromoteToAdmin();
  const removeAdmin = useRemoveAdmin();

  const admins = staffQuery.data ?? [];
  const loading = staffQuery.isPending;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [promoteEmail, setPromoteEmail] = useState('');

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    createAdmin.mutate(newAdmin, {
      onSuccess: () => {
        toast.success(t('ADDED'));
        setIsAddDialogOpen(false);
        setNewAdmin({ first_name: '', last_name: '', email: '', password: '' });
      },
      onError: (error: any) =>
        toast.error(error.response?.data?.message || t('ADD_ERROR')),
    });
  };

  const handlePromoteToAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    promoteUser.mutate(promoteEmail, {
      onSuccess: () => {
        toast.success(t('PROMOTED'));
        setIsAddDialogOpen(false);
        setPromoteEmail('');
      },
      onError: (error: any) =>
        toast.error(error.response?.data?.message || t('PROMOTE_ERROR')),
    });
  };

  const handleRemoveAdmin = (adminId: string) => {
    removeAdmin.mutate(adminId, {
      onSuccess: () => toast.success(t('REMOVED')),
      onError: (error: any) =>
        toast.error(error.response?.data?.message || t('REMOVE_ERROR')),
    });
  };

  const handleBulkRemove = () => {
    selectedAdmins.forEach(id => handleRemoveAdmin(id));
    setSelectedAdmins([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAdmins(filteredAdmins.map(a => a._id));
    } else {
      setSelectedAdmins([]);
    }
  };

  const handleSelectAdmin = (adminId: string, checked: boolean) => {
    if (checked) {
      setSelectedAdmins(prev => [...prev, adminId]);
    } else {
      setSelectedAdmins(prev => prev.filter(id => id !== adminId));
    }
  };

  const filteredAdmins = (() => {
    if (!admins) return [];
    if (!searchQuery) return admins;
    const query = searchQuery.toLowerCase();
    return admins.filter(
      admin =>
        admin._id.toLowerCase().includes(query) ||
        admin.first_name.toLowerCase().includes(query) ||
        admin.last_name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query),
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
              <Tabs defaultValue='new' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='new'>{t('TAB_NEW')}</TabsTrigger>
                  <TabsTrigger value='promote'>{t('TAB_PROMOTE')}</TabsTrigger>
                </TabsList>
                <TabsContent value='new'>
                  <form onSubmit={handleAddAdmin} className='space-y-4'>
                    <div className='grid grid-cols-2 gap-4'>
                      <Input
                        placeholder={t('FIRST_NAME')}
                        value={newAdmin.first_name}
                        onChange={e =>
                          setNewAdmin({
                            ...newAdmin,
                            first_name: e.target.value,
                          })
                        }
                        required
                      />
                      <Input
                        placeholder={t('LAST_NAME')}
                        value={newAdmin.last_name}
                        onChange={e =>
                          setNewAdmin({
                            ...newAdmin,
                            last_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <Input
                      type='email'
                      placeholder={t('EMAIL')}
                      value={newAdmin.email}
                      onChange={e =>
                        setNewAdmin({ ...newAdmin, email: e.target.value })
                      }
                      required
                    />
                    <Input
                      type='password'
                      placeholder={t('PASSWORD')}
                      value={newAdmin.password}
                      onChange={e =>
                        setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                      required
                    />
                    <Button type='submit' className='w-full'>
                      {t('ADD')}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value='promote'>
                  <form onSubmit={handlePromoteToAdmin} className='space-y-4'>
                    <Input
                      type='email'
                      placeholder={t('USER_EMAIL')}
                      value={promoteEmail}
                      onChange={e => setPromoteEmail(e.target.value)}
                      required
                    />
                    <Button type='submit' className='w-full'>
                      {t('PROMOTE')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
          {selectedAdmins.length > 0 && (
            <Button
              variant='destructive'
              onClick={handleBulkRemove}
              disabled={loading}
            >
              {t('REMOVE_SELECTED', { count: selectedAdmins.length })}
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
      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      selectedAdmins.length === filteredAdmins.length &&
                      filteredAdmins.length > 0
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
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className='text-center'>
                    {t('NONE_FOUND')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map(admin => (
                  <TableRow key={admin._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAdmins.includes(admin._id)}
                        onCheckedChange={checked =>
                          handleSelectAdmin(admin._id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>{admin._id}</TableCell>
                    <TableCell>
                      {`${admin.first_name} ${admin.last_name}`}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{formatDate(admin.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600'
                        onClick={() => handleRemoveAdmin(admin._id)}
                        disabled={loading}
                      >
                        {t('REMOVE')}
                      </Button>
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
