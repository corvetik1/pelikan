import RecipeDetail from '@/components/recipes/RecipeDetail';
import { recipes } from '@/data/mock';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR 5 минут

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = recipes.find((r) => r.slug === slug);
  return {
    title: recipe ? `${recipe.title} | Рецепты` : 'Рецепт',
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params;
  const recipe = recipes.find((r) => r.slug === slug);
  if (!recipe) notFound();
  return <RecipeDetail recipe={recipe} />;
}
