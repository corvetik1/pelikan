import RecipesList from '@/components/recipes/RecipesList';
import { recipes } from '@/data/mock';
import type { Metadata } from 'next';

export const revalidate = 300; // ISR 5 минут

export const metadata: Metadata = {
  title: 'Рецепты',
};

export default function RecipesPage() {
  return <RecipesList recipes={recipes} />;
}
