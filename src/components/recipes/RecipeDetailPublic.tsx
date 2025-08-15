'use client';

import { Box, Stack, Chip, Typography, ImageList, ImageListItem } from '@mui/material';
import Image from 'next/image';
import type { AdminRecipe } from '@/types/admin';

interface RecipeDetailPublicProps {
  recipe: AdminRecipe;
}

export default function RecipeDetailPublic({ recipe }: RecipeDetailPublicProps): React.JSX.Element {
  const { title, img, images, shortDescription, cookingTime, category } = recipe;
  const gallery = (images && images.length > 0 ? images : (img ? [img] : []));

  return (
    <Box sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography component="h1" variant="h4" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {category && <Chip label={category} size="small" />}
          {typeof cookingTime === 'number' && <Chip label={`${cookingTime} мин`} size="small" />}
        </Stack>

        {gallery.length > 0 && (
          <ImageList cols={2} gap={8} sx={{ width: '100%' }}>
            {gallery.map((src) => (
              <ImageListItem key={src} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Image
                  src={src}
                  alt={title}
                  width={800}
                  height={533}
                  sizes="(max-width: 600px) 100vw, 800px"
                  style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}

        {shortDescription && (
          <Typography variant="body1" color="text.secondary">
            {shortDescription}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
