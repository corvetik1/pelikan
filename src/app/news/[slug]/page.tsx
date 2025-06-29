import NewsDetail from '@/components/news/NewsDetail';
import { news } from '@/data/mock';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR 5 min

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  return {
    title: article ? `${article.title} | Новости` : 'Новость',
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = news.find((n) => n.slug === slug);
  if (!article) notFound();
  return <NewsDetail article={article} />;
}
