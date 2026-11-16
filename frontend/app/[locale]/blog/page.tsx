import Client from './Client';
import generateSEO from '@/lib/seo';
import { getAllPosts } from '@/lib/blog';

export const generateMetadata = async () => {
  return generateSEO({
    title: 'Journal | Stories from the Atelier',
    description:
      'Stories from the BagCity atelier — craft, materials, and the small rituals behind a bag made to last.',
    alternates: {
      canonical: '/blog',
    },
    robots: {
      index: true,
      follow: true,
    },
  });
};

export default function Page() {
  const posts = getAllPosts();
  return <Client posts={posts} />;
}
