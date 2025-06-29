import CategoryProducts from '@/components/products/CategoryProducts';
import { categories } from '@/data/mock';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 300; // 5 minutes ISR

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  return {
    title: category ? `${category.title} | Продукция` : 'Продукция',
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const exists = categories.some((c) => c.slug === slug);
  if (!exists) notFound();
  return <CategoryProducts slug={slug} />;
}
