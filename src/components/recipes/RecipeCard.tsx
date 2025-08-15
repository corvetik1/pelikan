'use client';

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import type { AdminRecipe } from '@/types/admin';

interface RecipeCardProps {
  recipe: AdminRecipe;
  priority?: boolean;
}

/**
 * Карточка рецепта: изображение, название, категория и время приготовления.
 * Кликабельна, ведёт на детальную страницу `/recipes/[slug]`.
 */
export default function RecipeCard({ recipe, priority = false }: RecipeCardProps): React.JSX.Element {
  const { slug, title, shortDescription, cookingTime, img, category } = recipe;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/recipes/${slug}`}
        aria-label={`Открыть рецепт: ${title}`}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%', outline: 'none', '&:focus-visible': { boxShadow: (t) => `0 0 0 3px ${t.palette.primary.main}` } }}
      >
        {img && (
          <Box sx={{ position: 'relative', width: '100%', height: 180 }}>
            <Image
              src={img}
              alt={title}
              fill
              sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw"
              priority={priority}
              loading={priority ? undefined : 'lazy'}
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {category && <Chip label={category} size="small" />}
            {typeof cookingTime === 'number' && <Chip label={`${cookingTime} мин`} size="small" />}
          </Box>
          <Typography component="h3" variant="subtitle1" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {shortDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
