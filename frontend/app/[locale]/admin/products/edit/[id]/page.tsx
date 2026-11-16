'use client';

import { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useFilters } from '@/hooks/admin/use-admin-filters';
import {
  useAdminProduct,
  useUpdateProduct,
} from '@/hooks/admin/use-admin-products';
import {
  ChevronDown,
  LoaderCircle,
  PackagePlus,
  X,
  Plus,
  Tag,
  DollarSign,
  Layers,
  ArrowLeft,
  Save,
} from 'lucide-react';
import Color from '@/components/Admin/Products/Color';
import ImageGallery from '@/components/Admin/Products/ImageGallery';
import toast from 'react-hot-toast';

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations('ADMIN_PRODUCT_FORM');
  const { id } = use(params);
  const router = useRouter();
  const filtersQuery = useFilters();
  const categories = filtersQuery.data?.categories ?? [];
  const colors = filtersQuery.data?.colors ?? [];
  const productQuery = useAdminProduct(id);
  const updateProductMutation = useUpdateProduct();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const defaultImage =
    'https://res.cloudinary.com/dr0gslecu/image/upload/v1730150154/lvfef1ettpmxxvvk6gtz.png';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    priceRange: { maxVariantPrice: 0, minVariantPrice: 0 },
    image: [] as string[],
    variants: [] as { color: string; stock: number }[],
    slug: '',
  });

  const [currentVariant, setCurrentVariant] = useState({ color: '', stock: 0 });

  const FormSchema = z.object({
    name: z.string().min(3, t('ZOD_NAME_MIN')).max(100, t('ZOD_NAME_MAX')),
    description: z
      .string()
      .min(10, t('ZOD_DESC_MIN'))
      .max(1000, t('ZOD_DESC_MAX')),
    category: z.string().min(2, t('ZOD_CATEGORY')),
    priceRange: z.object({
      maxVariantPrice: z
        .number()
        .positive()
        .min(1, t('ZOD_PRICE_MIN'))
        .max(10000, t('ZOD_PRICE_MAX')),
      minVariantPrice: z
        .number()
        .positive()
        .min(1, t('ZOD_PRICE_MIN'))
        .max(10000, t('ZOD_PRICE_MAX')),
    }),
    variants: z.array(
      z.object({
        color: z.string().min(1, t('ZOD_COLOR')),
        stock: z.number().min(1, t('ZOD_STOCK')),
      }),
    ),
    image: z.array(z.string()),
    slug: z.string().min(3, t('ZOD_SLUG_MIN')).max(100, t('ZOD_SLUG_MAX')),
  });

  const formValuesFromProduct = useMemo(() => {
    const product = productQuery.data;
    if (!product) return undefined;

    const priceRange =
      product.priceRange &&
      typeof product.priceRange === 'object' &&
      !Array.isArray(product.priceRange)
        ? product.priceRange
        : Array.isArray(product.priceRange) && product.priceRange.length > 0
          ? product.priceRange[0]
          : { maxVariantPrice: 0, minVariantPrice: 0 };

    const categoryName =
      typeof product.category === 'object'
        ? product.category?.name
        : product.category || '';

    const normalizedVariants = (product.variants || []).map((variant: any) => ({
      color:
        typeof variant.color === 'object' && variant.color?._id
          ? variant.color._id
          : variant.color || '',
      stock: variant.stock || 0,
    }));

    return {
      name: product.name || '',
      description: product.description || '',
      category: categoryName,
      priceRange,
      image: product.images || [],
      variants: normalizedVariants,
      slug: product.slug || '',
    };
  }, [productQuery.data]);

  const {
    register,
    formState: { errors },
    setValue,
    reset,
    trigger,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (formValuesFromProduct) {
      queueMicrotask(() => {
        const imgs = productQuery.data?.images || [];
        setFormData(formValuesFromProduct);
        setImageUrls(imgs);
        setOriginalImageUrls(imgs);
        reset(formValuesFromProduct);
      });
    }
  }, [formValuesFromProduct, productQuery.data?.images, reset]);

  useEffect(() => {
    if (productQuery.isError) {
      toast.error(t('LOAD_ERROR'));
    }
  }, [productQuery.isError, t]);

  if (productQuery.isPending) {
    return (
      <div className='mb-10 md:pe-6'>
        <div className='flex min-h-[360px] items-center justify-center'>
          <LoaderCircle className='animate-spin text-gray-400' size={28} />
        </div>
      </div>
    );
  }

  if (!productQuery.data) {
    return (
      <div className='mb-10 md:pe-6'>
        <div className='flex items-center gap-3 py-6'>
          <button
            type='button'
            onClick={() => router.back()}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className='text-xl md:text-2xl font-bold flex items-center gap-2'>
            <PackagePlus size={22} />
            {t('EDIT_TITLE')}
          </h1>
        </div>
        <p className='text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3'>
          {t('NOT_FOUND')}
        </p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (
      name === 'name' ||
      name === 'category' ||
      name === 'description' ||
      name === 'slug'
    ) {
      register(name).onChange(e);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value !== '' ? parseFloat(e.target.value) : 0;
    setFormData(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, maxVariantPrice: price },
    }));
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value !== '' ? parseFloat(e.target.value) : 0;
    setFormData(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, minVariantPrice: price },
    }));
  };

  const handleImageChange = (urls: string[]) => {
    setFormData(prev => ({ ...prev, image: urls }));
  };

  const handleVariantChange = (field: string, value: string | number) => {
    setCurrentVariant(prev => ({ ...prev, [field]: value }));
  };

  const addVariant = () => {
    if (!currentVariant.color || currentVariant.stock <= 0) {
      toast.error(t('VARIANT_ERROR'));
      return;
    }
    const newVariants = [...formData.variants, currentVariant];
    setFormData(prev => ({ ...prev, variants: newVariants }));
    setValue('variants', newVariants);
    trigger('variants');
    setCurrentVariant({ color: '', stock: 0 });
  };

  const removeVariant = (index: number) => {
    setFormData(prev => {
      const newVariants = prev.variants.filter((_, i) => i !== index);
      setValue('variants', newVariants);
      return { ...prev, variants: newVariants };
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (imageUrls.length === 0) {
        setFormData(prev => ({ ...prev, image: [defaultImage] }));
      }

      const removedImages = originalImageUrls.filter(url => !imageUrls.includes(url));
      if (removedImages.length > 0) {
        await fetch('/api/cloudinary/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: removedImages }),
        });
      }

      const categoryId =
        categories.find(c => c.name === formData.category)?._id ||
        formData.category;
      const { maxVariantPrice, minVariantPrice } = formData.priceRange;
      const priceRange = [{ maxVariantPrice, minVariantPrice }];
      const images = formData.image;

      const transformedVariants = formData.variants.map(variant => {
        const getColorId = (color: string | any): string => {
          if (!color) throw new Error('Color is required');
          if (typeof color === 'string' && /^[0-9a-fA-F]{24}$/.test(color))
            return color;
          if (typeof color === 'object' && color) {
            if ('_id' in color && color._id) return color._id;
            if ('name' in color && color.name) {
              const foundColor = colors.find(c => c.name === color.name);
              if (foundColor?._id) return foundColor._id;
            }
          }
          throw new Error(`Invalid color: ${JSON.stringify(color)}`);
        };
        return { color: getColorId(variant.color), stock: variant.stock };
      });

      await updateProductMutation.mutateAsync({
        id,
        data: {
          name: formData.name,
          description: formData.description,
          category: categoryId,
          priceRange,
          images,
          variants: transformedVariants,
          slug: formData.slug,
        } as any,
      });

      toast.success(t('UPDATED'));
      setIsLoading(false);
      router.push('/admin/products');
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error';
      toast.error(t('UPDATE_ERROR', { message: errorMessage }));
      setIsLoading(false);
    }
  };

  const getColorHex = (color: string | any) => {
    if (!color) return '';
    if (typeof color === 'object' && color?.hexCode) return color.hexCode;
    if (typeof color === 'string') {
      return colors.find(c => c._id === color)?.hexCode || '#000000';
    }
    return '#000000';
  };

  const getColorName = (color: string | any) => {
    if (!color) return '';
    if (typeof color === 'object' && color?.name) return color.name;
    if (typeof color === 'string') {
      return colors.find(c => c._id === color)?.name || '';
    }
    return '';
  };

  return (
    <div className='mb-10 md:pe-6'>
      {/* Page header */}
      <div className='flex justify-between items-center py-6'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => router.back()}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
            aria-label='Go back'
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className='text-xl md:text-2xl font-bold flex items-center gap-2'>
            <PackagePlus size={22} />
            {t('EDIT_TITLE')}
          </h1>
        </div>
        <button
          type='button'
          onClick={onSubmit}
          disabled={isLoading}
          className='px-4 py-2 bg-black text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors'
        >
          {isLoading ? (
            <LoaderCircle size={16} className='animate-spin' />
          ) : (
            <Save size={16} />
          )}
          {t('SUBMIT_EDIT')}
        </button>
      </div>

      <form id='product-form' className='flex flex-col md:flex-row gap-6'>
        {/* Left column */}
        <div className='flex flex-col gap-5 basis-3/5'>
          {/* General Info */}
          <div className='bg-white border border-gray-100 shadow-sm p-6 rounded-2xl'>
            <div className='flex items-center gap-2 mb-5 pb-4 border-b border-gray-100'>
              <div className='p-1.5 bg-blue-50 rounded-lg'>
                <Tag size={15} className='text-blue-600' />
              </div>
              <h2 className='text-xl font-semibold'>{t('GENERAL_INFO')}</h2>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1.5'>
                  {t('NAME')}
                </label>
                <input
                  id='name'
                  type='text'
                  {...register('name')}
                  value={formData.name}
                  onChange={handleChange}
                  className='bg-gray-50 border border-gray-200 block w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors'
                />
                {errors.name && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1.5'>
                  {t('DESCRIPTION')}
                </label>
                <textarea
                  className='bg-gray-50 border border-gray-200 block w-full px-3 py-2.5 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors'
                  value={formData.description}
                  onChange={e =>
                    handleChange({
                      target: { name: 'description', value: e.target.value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  placeholder={t('DESC_PLACEHOLDER')}
                  rows={4}
                />
                {errors.description && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className='flex gap-4'>
                <div className='w-full'>
                  <label className='text-sm font-medium text-gray-700 block mb-1.5'>
                    {t('CATEGORY')}
                  </label>
                  <div className='relative'>
                    <select
                      id='category'
                      {...register('category')}
                      value={formData.category}
                      onChange={handleChange}
                      className='bg-gray-50 border border-gray-200 block w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 appearance-none pe-8 transition-colors'
                    >
                      <option value=''>{t('SELECT_CATEGORY')}</option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className='pointer-events-none absolute inset-e-2.5 top-1/2 -translate-y-1/2 text-gray-400'
                    />
                  </div>
                  {errors.category && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div className='w-full'>
                  <label className='text-sm font-medium text-gray-700 block mb-1.5'>
                    {t('SLUG')}
                  </label>
                  <input
                    id='slug'
                    type='text'
                    {...register('slug')}
                    value={formData.slug}
                    onChange={handleChange}
                    className='bg-gray-50 border border-gray-200 block w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors'
                  />
                  {errors.slug && (
                    <p className='text-red-500 text-xs mt-1'>
                      {errors.slug.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className='bg-white border border-gray-100 shadow-sm p-6 rounded-2xl'>
            <div className='flex items-center gap-2 mb-5 pb-4 border-b border-gray-100'>
              <div className='p-1.5 bg-green-50 rounded-lg'>
                <DollarSign size={15} className='text-green-600' />
              </div>
              <h2 className='text-xl font-semibold'>{t('PRICING')}</h2>
            </div>

            <div className='flex gap-4'>
              <div className='w-full'>
                <label className='text-sm font-medium text-gray-700 block mb-1.5'>
                  {t('PRICE')}
                </label>
                <div className='relative'>
                  <span className='absolute inset-s-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none'>
                    $
                  </span>
                  <input
                    id='maxPrice'
                    type='number'
                    {...register('priceRange.maxVariantPrice', {
                      valueAsNumber: true,
                      onChange: handleMaxPriceChange,
                    })}
                    value={
                      formData.priceRange.maxVariantPrice === 0
                        ? ''
                        : formData.priceRange.maxVariantPrice.toString()
                    }
                    min={1}
                    placeholder='0.00'
                    className='bg-gray-50 border border-gray-200 block w-full ps-7 pe-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors'
                  />
                </div>
                {errors.priceRange?.maxVariantPrice && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.priceRange.maxVariantPrice.message}
                  </p>
                )}
              </div>

              <div className='w-full'>
                <label className='text-sm font-medium text-gray-700 block mb-1.5'>
                  {t('MIN_PRICE')}
                </label>
                <div className='relative'>
                  <span className='absolute inset-s-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none'>
                    $
                  </span>
                  <input
                    id='minPrice'
                    type='number'
                    {...register('priceRange.minVariantPrice', {
                      valueAsNumber: true,
                      onChange: handleMinPriceChange,
                    })}
                    value={
                      formData.priceRange.minVariantPrice === 0
                        ? ''
                        : formData.priceRange.minVariantPrice.toString()
                    }
                    min={1}
                    placeholder='0.00'
                    className='bg-gray-50 border border-gray-200 block w-full ps-7 pe-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors'
                  />
                </div>
                {errors.priceRange?.minVariantPrice && (
                  <p className='text-red-500 text-xs mt-1'>
                    {errors.priceRange.minVariantPrice.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className='bg-white border border-gray-100 shadow-sm p-6 rounded-2xl'>
            <div className='flex items-center gap-2 mb-5 pb-4 border-b border-gray-100'>
              <div className='p-1.5 bg-purple-50 rounded-lg'>
                <Layers size={15} className='text-purple-600' />
              </div>
              <h2 className='text-xl font-semibold'>{t('VARIANTS')}</h2>
            </div>

            {/* Variant builder */}
            <div className='bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4'>
              <div>
                <label className='text-sm font-medium text-gray-700 block mb-2'>
                  {t('COLOR')}
                </label>
                {currentVariant.color && (
                  <div className='flex items-center gap-2 mb-3'>
                    <div
                      className='w-5 h-5 rounded-full border border-white shadow-sm ring-1 ring-gray-200'
                      style={{
                        backgroundColor: getColorHex(currentVariant.color),
                      }}
                    />
                    <span className='text-sm text-gray-600 font-medium'>
                      {getColorName(currentVariant.color)}
                    </span>
                  </div>
                )}
                <Color
                  selectedColor={currentVariant.color}
                  onColorChange={color => handleVariantChange('color', color)}
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700 block mb-1.5'>
                  {t('STOCK')}
                </label>
                <input
                  type='number'
                  value={currentVariant.stock || ''}
                  onChange={e =>
                    handleVariantChange('stock', parseInt(e.target.value) || 0)
                  }
                  min={0}
                  placeholder='0'
                  className='bg-white border border-gray-200 block w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-colors'
                />
              </div>

              <button
                type='button'
                onClick={addVariant}
                className='w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-black hover:text-black flex items-center justify-center gap-2 transition-colors'
              >
                <Plus size={15} />
                {t('ADD_VARIANT')}
              </button>
            </div>

            {/* Added variants list */}
            {formData.variants.length > 0 && (
              <div className='mt-5'>
                <p className='text-sm font-medium text-gray-700 mb-3'>
                  {t('ADDED_VARIANTS')}{' '}
                  <span className='text-gray-400 font-normal'>
                    ({formData.variants.length})
                  </span>
                </p>
                <div className='space-y-2'>
                  {formData.variants.map((variant, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3 rounded-lg'
                    >
                      <div className='flex items-center gap-3'>
                        {variant.color && (
                          <div
                            className='w-6 h-6 rounded-full border border-white shadow-sm ring-1 ring-gray-200'
                            style={{
                              backgroundColor: getColorHex(variant.color),
                            }}
                          />
                        )}
                        <div>
                          <p className='text-sm font-medium text-gray-800'>
                            {getColorName(variant.color)}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {t('VARIANT_STOCK', { count: variant.stock })}
                          </p>
                        </div>
                      </div>
                      <button
                        type='button'
                        onClick={() => removeVariant(index)}
                        className='p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors'
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className='basis-2/5'>
          <div className='bg-white border border-gray-100 shadow-sm p-6 rounded-2xl sticky top-6'>
            <h4 className='text-xl font-semibold mb-5 pb-4 border-b border-gray-100'>
              {t('IMAGES')}
            </h4>
            <ImageGallery
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              handleImageChange={handleImageChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
