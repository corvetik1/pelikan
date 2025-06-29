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
import type { Recipe } from '@/data/mock';

interface RecipeCardProps {
  recipe: Recipe;
}

/**
 * Карточка рецепта: изображение, название, категория и время приготовления.
 * Кликабельна, ведёт на детальную страницу `/recipes/[slug]`.
 */
export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { slug, title, img, cookingTime, category } = recipe;
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea
        component={Link}
        href={`/recipes/${slug}`}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
      >
        <Box sx={{ position: 'relative', width: '100%', height: 180 }}>
            <Image src={img} alt={title} fill sizes="(max-width:600px) 100vw, 320px" style={{ objectFit: 'cover' }} />
          </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography component="h3" variant="subtitle1" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={category} size="small" />
            <Chip label={`${cookingTime} мин`} size="small" />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
