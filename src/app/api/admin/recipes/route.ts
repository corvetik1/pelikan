import { NextResponse } from 'next/server';
import { recipes as initial } from '@/data/mock';

// In-memory store for dev purposes
const storeKey = '__mock_recipes__' as const;

type RecipeStore = typeof initial;

const globalForRecipes = globalThis as typeof globalThis & {
  [storeKey]: RecipeStore;
};

if (!globalForRecipes[storeKey]) {
  // deep clone so import data is not mutated
  globalForRecipes[storeKey] = JSON.parse(JSON.stringify(initial)) as RecipeStore;
}

const recipes: RecipeStore = globalForRecipes[storeKey];

export async function GET() {
  return NextResponse.json(recipes);
}

export async function POST(req: Request) {
  const body = await req.json();
  const id = `r${Date.now()}`;
  const newRecipe = { id, ...body };
  recipes.push(newRecipe);
  return NextResponse.json(newRecipe, { status: 201 });
}
