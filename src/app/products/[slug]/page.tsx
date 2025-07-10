import CategoryProducts from '@/components/products/CategoryProducts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const revalidate = 300; // 5 minutes ISR

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const rows = await prisma.product.groupBy({ by: ['category'] });
  return rows.map((r) => ({ slug: r.category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Преобразуем slug в Title-cased string for title meta
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${title} | Продукция`,
  } as Metadata;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const exists = await prisma.product.findFirst({ where: { category: slug }, select: { id: true } });
  if (!exists) notFound();
  return <CategoryProducts slug={slug} />;
}
