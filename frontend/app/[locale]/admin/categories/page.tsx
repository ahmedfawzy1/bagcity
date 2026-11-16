'use client';

import { Link } from '@/i18n/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Color } from '@/app/types/filter';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  useFilters,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateColor,
  useUpdateColor,
  useDeleteColor,
} from '@/hooks/admin/use-admin-filters';
import toast from 'react-hot-toast';
import { CheckIcon, XIcon } from 'lucide-react';
import ColorPicker from 'react-pick-color';

export default function CategoriesPage() {
  const t = useTranslations('ADMIN_CATEGORIES');
  const filtersQuery = useFilters();
  const categories = filtersQuery.data?.categories ?? [];
  const colors = filtersQuery.data?.colors ?? [];

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    slug: '',
  });
  const [newColor, setNewColor] = useState<Partial<Color>>({
    name: '',
    hexCode: '',
  });

  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [tempHexCode, setTempHexCode] = useState<string>('');

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategory, setEditingCategory] = useState({
    name: '',
    description: '',
    slug: '',
  });
  const [editingColorId, setEditingColorId] = useState<string | null>(null);
  const [editingColor, setEditingColor] = useState<Partial<Color>>({
    name: '',
    hexCode: '',
  });
  const [showColorPickerEdit, setShowColorPickerEdit] = useState(false);
  const [tempEditHexCode, setTempEditHexCode] = useState<string>('');

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory.mutate(categoryId, {
      onSuccess: () => toast.success(t('CATEGORY_DELETED')),
      onError: (error: any) =>
        toast.error(error?.response?.data?.message || t('CATEGORY_DELETE_ERROR')),
    });
  };

  const handleDeleteColor = (colorId: string) => {
    deleteColor.mutate(colorId, {
      onSuccess: () => toast.success(t('COLOR_DELETED')),
      onError: (error: any) =>
        toast.error(error?.response?.data?.message || t('COLOR_DELETE_ERROR')),
    });
  };

  const handleBulkDeleteCategories = async () => {
    const results = await Promise.allSettled(
      selectedCategories.map(id => deleteCategory.mutateAsync(id)),
    );
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed === 0) {
      toast.success(t('CATEGORIES_BULK_DELETED'));
      setSelectedCategories([]);
    } else if (successful === 0) {
      const firstError = results.find(
        r => r.status === 'rejected',
      ) as PromiseRejectedResult;
      toast.error(
        firstError.reason?.response?.data?.message || t('CATEGORIES_BULK_ERROR'),
      );
    } else {
      toast.error(t('CATEGORIES_PARTIAL', { successful, failed }));
      setSelectedCategories([]);
    }
  };

  const handleBulkDeleteColors = async () => {
    const results = await Promise.allSettled(
      selectedColors.map(id => deleteColor.mutateAsync(id)),
    );
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed === 0) {
      toast.success(t('COLORS_BULK_DELETED'));
      setSelectedColors([]);
    } else if (successful === 0) {
      const firstError = results.find(
        r => r.status === 'rejected',
      ) as PromiseRejectedResult;
      toast.error(
        firstError.reason?.response?.data?.message || t('COLORS_BULK_ERROR'),
      );
    } else {
      toast.error(t('COLORS_PARTIAL', { successful, failed }));
      setSelectedColors([]);
    }
  };

  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(categories.map(c => c._id || ''));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId]);
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
    }
  };

  const handleSelectAllColors = (checked: boolean) => {
    if (checked) {
      setSelectedColors(colors.map(c => c._id || ''));
    } else {
      setSelectedColors([]);
    }
  };

  const handleSelectColor = (colorId: string, checked: boolean) => {
    if (checked) {
      setSelectedColors(prev => [...prev, colorId]);
    } else {
      setSelectedColors(prev => prev.filter(id => id !== colorId));
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description || !newCategory.slug) {
      toast.error(t('FILL_ALL'));
      return;
    }
    createCategory.mutate(newCategory as any, {
      onSuccess: () => {
        setNewCategory({ name: '', description: '', slug: '' });
        setShowCategoryInput(false);
        toast.success(t('CATEGORY_ADDED'));
      },
      onError: () => toast.error(t('CATEGORY_ADD_ERROR')),
    });
  };

  const handleAddColor = () => {
    if (!newColor.name || !newColor.hexCode) {
      toast.error(t('FILL_ALL'));
      return;
    }
    const colorData: Color = {
      _id: '',
      name: newColor.name,
      hexCode: newColor.hexCode,
      __v: 0,
    };
    createColor.mutate(colorData, {
      onSuccess: () => {
        setNewColor({ name: '', hexCode: '' });
        setShowColorInput(false);
        toast.success(t('COLOR_ADDED'));
      },
      onError: () => toast.error(t('COLOR_ADD_ERROR')),
    });
  };

  const handleEditCategory = (cat: any) => {
    setEditingCategoryId(cat._id);
    setEditingCategory({
      name: cat.name,
      description: cat.description,
      slug: cat.slug,
    });
  };
  const handleSaveCategory = (id: string) => {
    updateCategory.mutate(
      { id, data: editingCategory },
      {
        onSuccess: () => {
          setEditingCategoryId(null);
          toast.success(t('CATEGORY_UPDATED'));
        },
        onError: () => toast.error(t('CATEGORY_UPDATE_ERROR')),
      },
    );
  };
  const handleCancelCategory = () => {
    setEditingCategoryId(null);
  };

  const handleEditColor = (color: any) => {
    setEditingColorId(color._id);
    setEditingColor({ name: color.name, hexCode: color.hexCode });
  };
  const handleSaveColor = (id: string) => {
    updateColor.mutate(
      { id, data: editingColor },
      {
        onSuccess: () => {
          setEditingColorId(null);
          toast.success(t('COLOR_UPDATED'));
        },
        onError: () => toast.error(t('COLOR_UPDATE_ERROR')),
      },
    );
  };
  const handleCancelColor = () => {
    setEditingColorId(null);
    setShowColorPickerEdit(false);
  };

  return (
    <div className='px-4 py-6 space-y-6'>
      <div className=''>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-2xl font-bold'>{t('TITLE')}</h1>
          <div className='flex gap-2'>
            {selectedCategories.length > 0 && (
              <Button
                variant='destructive'
                onClick={handleBulkDeleteCategories}
                className='h-8'
              >
                {t('DELETE_SELECTED', { count: selectedCategories.length })}
              </Button>
            )}
            <Button
              onClick={() => setShowCategoryInput(!showCategoryInput)}
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 px-4 py-2 rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
            >
              {showCategoryInput ? t('CANCEL') : t('ADD_CATEGORY')}
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedCategories.length === categories.length &&
                        categories.length > 0
                      }
                      onCheckedChange={handleSelectAllCategories}
                    />
                  </TableHead>
                  <TableHead>{t('COL_NAME')}</TableHead>
                  <TableHead>{t('COL_DESCRIPTION')}</TableHead>
                  <TableHead>{t('COL_SLUG')}</TableHead>
                  <TableHead>{t('COL_ACTIONS')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showCategoryInput && (
                  <TableRow>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder={t('PLACEHOLDER_NAME')}
                        value={newCategory.name}
                        onChange={e =>
                          setNewCategory({
                            ...newCategory,
                            name: e.target.value,
                          })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder={t('PLACEHOLDER_DESC')}
                        value={newCategory.description}
                        onChange={e =>
                          setNewCategory({
                            ...newCategory,
                            description: e.target.value,
                          })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder={t('PLACEHOLDER_SLUG')}
                        value={newCategory.slug}
                        onChange={e =>
                          setNewCategory({
                            ...newCategory,
                            slug: e.target.value,
                          })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={handleAddCategory}>{t('ADD')}</Button>
                    </TableCell>
                  </TableRow>
                )}
                {categories.map(category => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCategories.includes(
                          category._id || '',
                        )}
                        onCheckedChange={checked =>
                          handleSelectCategory(
                            category._id || '',
                            checked as boolean,
                          )
                        }
                      />
                    </TableCell>
                    {editingCategoryId === category._id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingCategory.name}
                            onChange={e =>
                              setEditingCategory({
                                ...editingCategory,
                                name: e.target.value,
                              })
                            }
                            className='h-8 !ring-0'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingCategory.description}
                            onChange={e =>
                              setEditingCategory({
                                ...editingCategory,
                                description: e.target.value,
                              })
                            }
                            className='h-8 !ring-0'
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editingCategory.slug}
                            onChange={e =>
                              setEditingCategory({
                                ...editingCategory,
                                slug: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Button
                              size='sm'
                              onClick={() => handleSaveCategory(category._id!)}
                            >
                              {t('SAVE')}
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={handleCancelCategory}
                            >
                              {t('CANCEL')}
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>{category.slug}</TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Link
                              href={`/admin/categories/edit/${category._id}`}
                              className='text-blue-600 hover:underline'
                              onClick={e => {
                                e.preventDefault();
                                handleEditCategory(category);
                              }}
                            >
                              {t('EDIT')}
                            </Link>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-600'
                              onClick={() =>
                                handleDeleteCategory(category._id || '')
                              }
                            >
                              {t('DELETE')}
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className=''>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-2xl font-bold'>{t('COLORS_TITLE')}</h1>
          <div className='flex gap-2'>
            {selectedColors.length > 0 && (
              <Button
                variant='destructive'
                onClick={handleBulkDeleteColors}
                className='h-8'
              >
                {t('DELETE_SELECTED', { count: selectedColors.length })}
              </Button>
            )}
            <Button
              onClick={() => setShowColorInput(!showColorInput)}
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap h-9 px-4 py-2 rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
            >
              {showColorInput ? t('CANCEL') : t('ADD_COLOR')}
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-8'>
                    <Checkbox
                      checked={
                        selectedColors.length === colors.length &&
                        colors.length > 0
                      }
                      onCheckedChange={handleSelectAllColors}
                    />
                  </TableHead>
                  <TableHead>{t('COL_NAME')}</TableHead>
                  <TableHead className='text-center'>{t('COL_HEX')}</TableHead>
                  <TableHead className='text-center'>{t('COL_ACTIONS')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showColorInput && (
                  <TableRow>
                    <TableCell className='w-8'>
                      <Checkbox />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder={t('PLACEHOLDER_COLOR_NAME')}
                        value={newColor.name}
                        onChange={e =>
                          setNewColor({ ...newColor, name: e.target.value })
                        }
                        className='h-8 !ring-0'
                      />
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='relative'>
                        {newColor.hexCode ? (
                          <button
                            type='button'
                            onClick={() => {
                              setTempHexCode(newColor.hexCode || '#ffffff');
                              setShowColorPicker(true);
                            }}
                            className='text-blue-600 hover:underline'
                          >
                            {newColor.hexCode}
                          </button>
                        ) : (
                          <Button
                            type='button'
                            onClick={() => {
                              setTempHexCode(newColor.hexCode || '#ffffff');
                              setShowColorPicker(true);
                            }}
                            className='bg-primary rounded-lg text-center text-[14px] px-3 py-1 cursor-pointer hover:bg-primary/90 transition-all duration-200'
                          >
                            {t('SELECT_COLOR')}
                          </Button>
                        )}
                        {showColorPicker && (
                          <div className='absolute z-10 mt-2'>
                            <div className='bg-white pt-1 rounded-lg shadow-lg'>
                              <div className='flex justify-end items-center'>
                                <button
                                  type='button'
                                  onClick={() => setShowColorPicker(false)}
                                  className='p-1 cursor-pointer'
                                >
                                  <XIcon size={16} />
                                </button>
                                <button
                                  type='button'
                                  onClick={() => {
                                    setNewColor({
                                      ...newColor,
                                      hexCode: tempHexCode,
                                    });
                                    setShowColorPicker(false);
                                  }}
                                  className='p-1 cursor-pointer'
                                >
                                  <CheckIcon size={16} />
                                </button>
                              </div>
                              <ColorPicker
                                color={tempHexCode}
                                onChange={color => setTempHexCode(color.hex)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex items-center gap-2 justify-center'>
                        <Button onClick={handleAddColor}>{t('ADD')}</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {colors.map(color => (
                  <TableRow key={color._id}>
                    <TableCell className='w-8'>
                      <Checkbox
                        checked={selectedColors.includes(color._id || '')}
                        onCheckedChange={checked =>
                          handleSelectColor(color._id || '', checked as boolean)
                        }
                      />
                    </TableCell>
                    {editingColorId === color._id ? (
                      <>
                        <TableCell>
                          <Input
                            value={editingColor.name}
                            onChange={e =>
                              setEditingColor({
                                ...editingColor,
                                name: e.target.value,
                              })
                            }
                          />
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='relative flex flex-row-reverse items-center gap-2 justify-center'>
                            {editingColor.hexCode ? (
                              <button
                                type='button'
                                onClick={() => {
                                  setTempEditHexCode(
                                    editingColor.hexCode || '#ffffff',
                                  );
                                  setShowColorPickerEdit(true);
                                }}
                                className='text-blue-600 hover:underline text-center w-20 font-mono'
                              >
                                {editingColor.hexCode}
                              </button>
                            ) : (
                              <Button
                                type='button'
                                onClick={() => {
                                  setTempEditHexCode(
                                    editingColor.hexCode || '#ffffff',
                                  );
                                  setShowColorPickerEdit(true);
                                }}
                                className='bg-[#efefef] rounded-lg text-center text-[14px] px-3 py-1 cursor-pointer hover:bg-[#e2e2e2] transition-all duration-200'
                              >
                                {t('SELECT_COLOR')}
                              </Button>
                            )}
                            {showColorPickerEdit && (
                              <div className='absolute z-50 mt-2'>
                                <div className='bg-white pt-1 rounded-lg shadow-lg'>
                                  <div className='flex justify-end items-center'>
                                    <button
                                      type='button'
                                      onClick={() =>
                                        setShowColorPickerEdit(false)
                                      }
                                      className='p-1 cursor-pointer'
                                    >
                                      <XIcon size={16} />
                                    </button>
                                    <button
                                      type='button'
                                      onClick={() => {
                                        setEditingColor({
                                          ...editingColor,
                                          hexCode: tempEditHexCode,
                                        });
                                        setShowColorPickerEdit(false);
                                      }}
                                      className='p-1 cursor-pointer'
                                    >
                                      <CheckIcon size={16} />
                                    </button>
                                  </div>
                                  <ColorPicker
                                    color={tempEditHexCode}
                                    onChange={color =>
                                      setTempEditHexCode(color.hex)
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {editingColor.hexCode && (
                              <div
                                className='w-6 h-6 rounded-full border ms-2'
                                style={{
                                  backgroundColor: editingColor.hexCode,
                                }}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center gap-2 justify-center'>
                            <Button
                              size='sm'
                              onClick={() => handleSaveColor(color._id!)}
                            >
                              {t('SAVE')}
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              onClick={handleCancelColor}
                            >
                              {t('CANCEL')}
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{color.name}</TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center gap-2 justify-center'>
                            <div
                              className='w-6 h-6 rounded-full border'
                              style={{ backgroundColor: color.hexCode }}
                            />
                            <span className='text-center w-14 font-mono'>
                              {color.hexCode}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-center'>
                          <div className='flex items-center gap-2 justify-center'>
                            <Link
                              href={`/admin/colors/edit/${color._id}`}
                              className='text-blue-600 hover:underline'
                              onClick={e => {
                                e.preventDefault();
                                handleEditColor(color);
                              }}
                            >
                              {t('EDIT')}
                            </Link>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='text-red-600'
                              onClick={() => handleDeleteColor(color._id)}
                            >
                              {t('DELETE')}
                            </Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
