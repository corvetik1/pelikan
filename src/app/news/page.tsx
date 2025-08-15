import NewsList from '@/components/news/NewsList';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';
import { siteOrigin } from '@/lib/site';
import type { AdminNews } from '@/types/admin';

export const runtime = 'nodejs';
export const revalidate = 300; // ISR 5 минут

export const metadata: Metadata = {
  title: 'Новости',
  alternates: { canonical: '/news' },
  openGraph: {
    type: 'website',
    title: 'Новости',
    url: '/news',
  },
  twitter: {
    card: 'summary',
    title: 'Новости',
  },
};

export default async function NewsPage(): Promise<React.JSX.Element> {
  const prismaItems = await prisma.news.findMany({
    orderBy: { date: 'desc' },
    include: { category: true },
  });
  const items: AdminNews[] = prismaItems.map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt,
    content: n.content,
    date: (n.date as Date).toISOString(),
    categoryId: n.categoryId ?? undefined,
    category: n.category
      ? {
          id: n.category.id,
          slug: n.category.slug,
          title: n.category.title,
          createdAt: (n.category as { createdAt?: Date | string }).createdAt?.toString() ?? '',
        }
      : undefined,
    img: n.img ?? undefined,
  }));

  const origin = siteOrigin();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.slice(0, 10).map((n, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'NewsArticle',
        headline: n.title,
        datePublished: n.date,
        description: n.excerpt,
        url: `${origin}/news/${n.slug}`,
        image: n.img || undefined,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <NewsList articles={items} />
    </>
  );
}
