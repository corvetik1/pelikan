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
import EditableField from '@/components/admin/EditableField';
import EditableImage from '@/components/admin/EditableImage';
import EditableParagraph from '@/components/admin/EditableParagraph';
import { useUpdateRecipeFieldMutation } from '@/redux/adminApi';
import type { Recipe } from '@/data/mock';

interface RecipeDetailProps {
  recipe: Recipe;
}

/**
 * Детальная страница рецепта.
 * Отображает галерею изображений, описание, ингредиенты и пошаговые инструкции приготовления.
 */
export default function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [updateRecipeField] = useUpdateRecipeFieldMutation();
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
          <EditableField
            value={title}
            onSave={(newTitle) => updateRecipeField({ id: recipe.id, patch: { title: newTitle } })}
            typographyProps={{ component: 'h1', variant: 'h4', sx: { flexGrow: 1 } }}
          />
          <Chip label={category} size="small" />
          <Chip label={`${cookingTime} мин`} size="small" />
        </Stack>

        {/* Gallery */}
        <ImageList cols={2} gap={8} sx={{ width: '100%' }}>
          {gallery.map((src, index) => (
            <ImageListItem key={src} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {index === 0 ? (
                <EditableImage
                  src={src}
                  alt={title}
                  width={800}
                  height={533}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                  onSave={(newSrc) => updateRecipeField({ id: recipe.id, patch: { img: newSrc } })}
                />
              ) : (
                <Image
                  src={src}
                  alt={title}
                  width={800}
                  height={533}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>

        {/* Description */}
        <EditableParagraph
          value={shortDescription}
          onSave={(newDescription) => updateRecipeField({ id: recipe.id, patch: { shortDescription: newDescription } })}
          typographyProps={{ variant: 'body1', color: 'text.secondary' }}
        />

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
