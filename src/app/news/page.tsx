import NewsList from '@/components/news/NewsList';
import { news } from '@/data/mock';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR 5 min

export const metadata: Metadata = {
  title: 'Новости',
};

export default function NewsPage() {
  // Сортировка по дате (новые сверху)
  const sorted = [...news].sort((a, b) => (a.date < b.date ? 1 : -1));
  return <NewsList articles={sorted} />;
}
