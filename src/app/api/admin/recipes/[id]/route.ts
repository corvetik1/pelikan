import { NextResponse } from 'next/server';
import { recipes as initial } from '@/data/mock';

const storeKey = '__mock_recipes__' as const;

type RecipeStore = typeof initial;

const globalForRecipes = globalThis as typeof globalThis & {
  [storeKey]: RecipeStore;
};

if (!globalForRecipes[storeKey]) {
  globalForRecipes[storeKey] = JSON.parse(JSON.stringify(initial)) as RecipeStore;
}

const recipes: RecipeStore = globalForRecipes[storeKey];

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const patch = await req.json();
  const idx = recipes.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  recipes[idx] = { ...recipes[idx], ...patch };
  return NextResponse.json(recipes[idx]);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const idx = recipes.findIndex((r) => r.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const removed = recipes.splice(idx, 1)[0];
  return NextResponse.json(removed);
}
