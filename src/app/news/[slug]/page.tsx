import NewsDetail from '@/components/news/NewsDetail';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { siteOrigin } from '@/lib/site';
import type { Metadata } from 'next';
import type { AdminNews } from '@/types/admin';

export const runtime = 'nodejs';
export const revalidate = 300; // ISR 5 минут

interface Props {
  params: { slug: string };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const items = await prisma.news.findMany({ select: { slug: true }, take: 1000 });
  return items.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const item = await prisma.news.findUnique({ where: { slug } });
  const url = `/news/${slug}`;
  return {
    title: item ? `${item.title} | Новости` : 'Новость',
    description: item?.excerpt,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: item?.title, url, images: item?.img ? [{ url: item.img }] : undefined },
    twitter: { card: item?.img ? 'summary_large_image' : 'summary', title: item?.title, images: item?.img ? [item.img] : undefined },
  };
}

export default async function NewsArticlePage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = params;
  const prismaItem = await prisma.news.findUnique({ where: { slug }, include: { category: true } });
  if (!prismaItem) notFound();

  const item: AdminNews = {
    id: prismaItem.id,
    slug: prismaItem.slug,
    title: prismaItem.title,
    excerpt: prismaItem.excerpt,
    content: prismaItem.content,
    date: (prismaItem.date as Date).toISOString(),
    categoryId: prismaItem.categoryId ?? undefined,
    category: prismaItem.category
      ? {
          id: prismaItem.category.id,
          slug: prismaItem.category.slug,
          title: prismaItem.category.title,
          createdAt: (prismaItem.category as { createdAt?: Date | string }).createdAt?.toString() ?? '',
        }
      : undefined,
    img: prismaItem.img ?? undefined,
  };

  const origin = siteOrigin();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.title,
    datePublished: item.date,
    description: item.excerpt,
    url: `${origin}/news/${item.slug}`,
    image: item.img || undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsDetail article={item} />
    </>
  );
}
