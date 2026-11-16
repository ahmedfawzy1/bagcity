import { getProducts } from '@/lib/products';
import { getAllPosts } from '@/lib/blog';
import { MetadataRoute } from 'next';

interface ProductResponse {
  products: Array<{
    slug: string;
    updatedAt: string | Date;
  }>;
  total_pages: number;
}

const criticalPages = [
  {
    url: '/',
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 1,
  },
  {
    url: '/shop',
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  },
  {
    url: '/about',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: '/our-story',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  {
    url: '/contact',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  },
  {
    url: '/faq',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
  {
    url: '/shipping-returns',
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  },
  {
    url: '/blog',
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const firstPage = (await getProducts(1)) as ProductResponse;
  const totalPages = firstPage.total_pages || 1;

  const allProductsPromises = Array.from({ length: totalPages }, (_, i) =>
    getProducts(i + 1),
  );

  const allPages = await Promise.all(allProductsPromises);
  const products = allPages.flatMap(
    (page: ProductResponse) => page.products || [],
  );

  const productsEntries: MetadataRoute.Sitemap = products.map(
    ({ slug, updatedAt }: { slug: string; updatedAt: string | Date }) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`,
      lastModified: new Date(updatedAt).toISOString(),
      changeFrequency: 'monthly',
      priority: 1,
    }),
  );

  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map(post => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...criticalPages.map(page => ({
      ...page,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${page.url}`,
    })),
    ...productsEntries,
    ...blogEntries,
  ];
}
