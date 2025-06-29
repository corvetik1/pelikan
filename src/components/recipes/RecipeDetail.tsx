'use client';

import {
  Box,
  Typography,
  Chip,
  Stack,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  ImageList,
  ImageListItem,
} from '@mui/material';
import Image from 'next/image';
import type { Recipe } from '@/data/mock';

interface RecipeDetailProps {
  recipe: Recipe;
}

/**
 * Детальная страница рецепта.
 * Отображает галерею изображений, описание, ингредиенты и пошаговые инструкции приготовления.
 */
export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const {
    title,
    img,
    images,
    shortDescription,
    ingredients,
    steps,
    cookingTime,
    category,
  } = recipe;

  const gallery = images && images.length > 0 ? images : [img];

  return (
    <Box sx={{ py: 4 }}>
      <Stack spacing={4}>
        {/* Title & Meta */}
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography component="h1" variant="h4" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Chip label={category} size="small" />
          <Chip label={`${cookingTime} мин`} size="small" />
        </Stack>

        {/* Gallery */}
        <ImageList cols={2} gap={8} sx={{ width: '100%' }}>
          {gallery.map((src) => (
            <ImageListItem key={src} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Image
                src={src}
                alt={title}
                width={800}
                height={533}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </ImageListItem>
          ))}
        </ImageList>

        {/* Description */}
        <Typography variant="body1" color="text.secondary">
          {shortDescription}
        </Typography>

        {/* Ingredients */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Ингредиенты
          </Typography>
          <List dense>
            {ingredients.map((ing) => (
              <ListItem key={ing} disablePadding>
                <ListItemText primary={ing} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        {/* Steps */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Приготовление
          </Typography>
          <Stepper orientation="vertical" nonLinear activeStep={-1} sx={{ gap: 2 }}>
            {steps.map((step, index) => (
              <Step key={step} completed>
                <StepLabel>{`${index + 1}. ${step}`}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Stack>
    </Box>
  );
}
