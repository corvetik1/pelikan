"use client";

import { Card, CardActionArea, CardContent, Typography, Chip, Box } from "@mui/material";
import { AdminRecipe } from "@/types/admin";

interface AdminRecipeCardProps {
  item: AdminRecipe;
  onClick?: () => void;
}

/**
 * Карточка рецепта для режима плитки в админ-панели.
 * Отображает изображение (если есть), категорию, название и время приготовления.
 */
export default function AdminRecipeCard({ item, onClick }: AdminRecipeCardProps) {
  const { title, img, category, cookingTime, shortDescription } = item;
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea sx={{ height: "100%" }} onClick={onClick}>
        {img && (
          <Box sx={{ position: 'relative', width: '100%', height: 180, overflow: 'hidden' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        )}
        <CardContent>
          <Box display="flex" gap={1} flexWrap="wrap" mb={1}>
            {category && <Chip label={category} size="small" />}
            <Chip label={`${cookingTime} мин`} size="small" />
          </Box>
          <Typography component="h3" variant="subtitle1" gutterBottom noWrap>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {shortDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
