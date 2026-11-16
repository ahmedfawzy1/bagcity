import { notFound } from "next/navigation";
import Client from "./Client";
import generateSEO from "@/lib/seo";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return generateSEO({
      title: "Story Not Found",
      description: "This story is no longer available. Return to the journal for the latest from the atelier.",
      alternates: { canonical: `/blog/${slug}` },
      robots: { index: false, follow: true },
    });
  }
  return generateSEO({
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    robots: { index: true, follow: true },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);
  return <Client post={post} related={related} />;
}
