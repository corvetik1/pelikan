import CategoryProducts from '@/components/products/CategoryProducts';
import { categories } from '@/data/mock';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 300; // 5 minutes ISR

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = categories.find((c) => c.slug === params.slug);
  return {
    title: category ? `${category.title} | Продукция` : 'Продукция',
  };
}

export default function CategoryPage({ params }: Props) {
  const { slug } = params;
  const exists = categories.some((c) => c.slug === slug);
  if (!exists) notFound();
  return <CategoryProducts slug={slug} />;
}
