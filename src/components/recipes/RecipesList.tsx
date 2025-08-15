'use client';

import { Box } from '@mui/material';
import RecipeCard from './RecipeCard';
import type { AdminRecipe } from '@/types/admin';

interface RecipesListProps {
  recipes: AdminRecipe[];
}

export default function RecipesList({ recipes }: RecipesListProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 2,
      }}
    >
      {recipes.map((r: AdminRecipe) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </Box>
  );
}
