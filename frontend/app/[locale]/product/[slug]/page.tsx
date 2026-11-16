import { notFound } from 'next/navigation';
import Client from './Client';
import generateSEO from '@/lib/seo';
import type {
  Product,
  ProductResponse,
  ProductsResponse,
} from '@/app/types/product';

export const revalidate = 3600;

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5001';

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${baseURL}/api/products/${slug}`, {
      next: { revalidate: 3600, tags: ['products', `product:${slug}`] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ProductResponse;
    return data.data ?? null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(
  categoryName: string,
  excludeId: string,
): Promise<Product[]> {
  if (!categoryName) return [];
  try {
    const params = new URLSearchParams({
      page: '1',
      limit: '8',
      category: categoryName,
    });
    const res = await fetch(`${baseURL}/api/products?${params.toString()}`, {
      next: { revalidate: 3600, tags: ['products'] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ProductsResponse;
    return (data.data ?? [])
      .filter(p => p._id !== excludeId)
      .slice(0, 4);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${baseURL}/api/products?page=1&limit=100`, {
      next: { revalidate: 3600, tags: ['products'] },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as ProductsResponse;
    return (data.data ?? []).map(p => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return generateSEO({
      title: 'Product Not Found',
      description:
        'This product is no longer available. Discover the rest of the BagCity collection of hand-finished leather bags.',
      alternates: {
        canonical: `/product/${slug}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    });
  }

  const categoryName = product.category?.name;
  const description =
    product.description ??
    `Shop the ${product.name}${categoryName ? ` from our ${categoryName} collection` : ''} — hand-finished in vegetable-tanned Italian leather. Complimentary shipping over $150.`;

  return generateSEO({
    title: product.name,
    description,
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(
    product.category?.name ?? '',
    product._id,
  );

  return <Client product={product} related={related} />;
}
